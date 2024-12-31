import { env } from "@/env";
import {
  resumeSchema,
  ResumeSchemaData,
} from "@/lib/reative-resume/dto/resume";
import { logger } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { getFontUrls } from "@/utils/resume-data-namespace";
import { ajaxUpload, getBrowser } from "@/server-utils";

const generateResume = async (resume: ResumeSchemaData, apiKey: string) => {
  const result: {
    fileUrl: string | null;
    error: any;
  } = {
    fileUrl: null,
    error: null,
  };
  try {
    const { browser, error } = await getBrowser();
    if (!browser) {
      logger.error("no browser");
      result.error = {
        message: "no browser",
        error,
      };
      return result;
    }
    const page = await browser.newPage();

    const publicUrl = env.NEXT_PUBLIC_RESUME_BUILDER_URL;

    let url = publicUrl;

    if ([publicUrl].some((url) => url.includes("localhost"))) {
      // Switch client URL from `localhost` to `host.docker.internal` in development
      // This is required because the browser is running in a container and the client is running on the host machine.
      url = url.replace("localhost", "host.docker.internal");

      await page.setRequestInterception(true);

      // Intercept requests of `localhost` to `host.docker.internal` in development
      // page.on("request", (request) => {
      //   if (request.url().startsWith(storageUrl)) {
      //     const modifiedUrl = request
      //       .url()
      //       .replace("localhost", `host.docker.internal`);

      //     void request.continue({ url: modifiedUrl });
      //   } else {
      //     void request.continue();
      //   }
      // });
    }

    // Set the data of the resume to be printed in the browser's session storage
    const numberPages = resume.data.metadata.layout.length;

    await page.evaluateOnNewDocument((data) => {
      window.localStorage.setItem("resume", JSON.stringify(data));
    }, resume.data);

    await page.goto(`${url}/artboard/preview`, { waitUntil: "networkidle0" });

    const pagesBuffer: Buffer[] = [];

    const processPage = async (index: number) => {
      const pageElement = await page.$(`[data-page="${index}"]`);

      const width =
        (await (await pageElement?.getProperty("scrollWidth"))?.jsonValue()) ??
        0;

      const height =
        (await (await pageElement?.getProperty("scrollHeight"))?.jsonValue()) ??
        0;

      const temporaryHtml = await page.evaluate((element) => {
        if (!element) {
          return;
        }
        const clonedElement = element.cloneNode(true) as HTMLDivElement;
        const temporaryHtml_ = document.body.innerHTML;
        document.body.innerHTML = clonedElement.outerHTML;
        return temporaryHtml_;
      }, pageElement);

      if (!temporaryHtml) {
        logger.error("undefined temporaryHtml");
        return;
      }

      const uint8array = await page.pdf({
        width,
        height,
        printBackground: true,
      });
      const buffer = Buffer.from(uint8array);
      pagesBuffer.push(buffer);

      await page.evaluate((temporaryHtml_) => {
        if (!temporaryHtml_) {
          logger.error("undefined temporaryHtml_");
          return;
        }
        document.body.innerHTML = temporaryHtml_;
      }, temporaryHtml);
    };

    // Loop through all the pages and print them, by first displaying them, printing the PDF and then hiding them back
    for (let index = 1; index <= numberPages; index++) {
      await processPage(index);
    }

    // Using 'pdf-lib', merge all the pages from their buffers into a single PDF
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);

    // Get information about fonts used in the resume from the metadata
    const fontData = resume.data.metadata.typography.font;
    const fontUrls = getFontUrls(fontData.family, fontData.variants);

    const responses = await Promise.all(
      fontUrls.map(async (url) => {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch font from ${url}`);
        }
        return await response.arrayBuffer();
      })
    );
    const fontsBuffer = responses;

    // Embed all the fonts in the PDF
    await Promise.all(fontsBuffer.map((buffer) => pdf.embedFont(buffer)));

    for (const element of pagesBuffer) {
      const page = await PDFDocument.load(element);
      const [copiedPage] = await pdf.copyPages(page, [0]);
      pdf.addPage(copiedPage);
    }

    // Save the PDF to storage and return the URL to download the resume
    // Store the URL in cache for future requests, under the previously generated hash digest
    result.error = "before pdf save";
    const file = await pdf.save();
    const buffer = Buffer.from(file);

    result.error = "after pdf save";

    // Convert the buffer to a Blob
    const blob = new Blob([buffer], { type: "application/pdf" });

    // Create a File object from the Blob
    const pdfFile = new File([blob], `${resume.title}.pdf`, {
      type: "application/pdf",
    });

    // Call ajaxUpload with the File object
    const { fileUrl: resumeUrl, error: uploadError } = await ajaxUpload(
      pdfFile,
      apiKey
    );

    if (uploadError) {
      result.error = uploadError;
      return result;
    }

    result.fileUrl = resumeUrl;

    if (!resumeUrl) {
      logger.error("resume url from 302 is empty");
    }

    // Close all the pages and disconnect from the browser
    await page.close();
    await browser.close();
    await browser.disconnect();
  } catch (error) {
    console.trace(error);
    result.error = error;
  }
  return result;
};

export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  let resumeData: ResumeSchemaData | null = null;
  let apiKey: string | null = null;
  try {
    resumeData = requestBody.data;
    // resumeData = resumeSchema.parse(requestBody.data);
    apiKey = requestBody.apiKey;
  } catch (error) {
    logger.error(error);
  }
  if (!resumeData) {
    return NextResponse.json(
      { error: "No JSON data provided" },
      { status: 400 }
    );
  }
  if (!apiKey) {
    return NextResponse.json({ error: "No apiKey provided" }, { status: 400 });
  }
  const { fileUrl, error } = await generateResume(resumeData, apiKey);

  if (!fileUrl) {
    return NextResponse.json({ url: null, error }, { status: 500 });
  }

  return NextResponse.json({ url: fileUrl }, { status: 200 });
}
