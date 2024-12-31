import { env } from "@/env";
import {
  resumeSchema,
  ResumeSchemaData,
} from "@/lib/reative-resume/dto/resume";
import { logger } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

import { ajaxUpload, getBrowser } from "@/server-utils";

const generateResumeImage = async (
  resume: ResumeSchemaData,
  apiKey: string
) => {
  try {
    const { browser } = await getBrowser();
    if (!browser) {
      logger.error("no browser");
      return;
    }
    const page = await browser.newPage();

    const publicUrl = env.NEXT_PUBLIC_RESUME_BUILDER_URL;
    let url = publicUrl;

    if ([publicUrl].some((url) => url.includes("localhost"))) {
      url = url.replace("localhost", "host.docker.internal");
      await page.setRequestInterception(true);
    }

    // Set the data of the resume to be printed in the browser's session storage
    await page.evaluateOnNewDocument((data) => {
      window.localStorage.setItem("resume", JSON.stringify(data));
    }, resume.data);

    await page.goto(`${url}/artboard/preview`, { waitUntil: "networkidle0" });

    // Capture the screenshot of the first page as a Buffer
    const pageElement = await page.$(`[data-page="1"]`);
    if (!pageElement) return;
    const screenshotBuffer = await pageElement.screenshot(); // 生成 Buffer

    // Convert Buffer to File
    const screenshotFile = new File([screenshotBuffer], "resume-image.png", {
      type: "image/png",
    });

    // Upload the screenshot file to the server
    const { fileUrl } = await ajaxUpload(screenshotFile, apiKey); // 调用 ajaxUpload

    // Close all the pages and disconnect from the browser
    await page.close();
    await browser.disconnect();

    return fileUrl; // 返回服务器的图片地址
  } catch (error) {
    console.trace(error);
  }
};

export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  const apiKey = req.headers.get("Authorization");

  let resumeData: ResumeSchemaData | null = null;
  let resumeError: string | null = null;
  try {
    resumeData = requestBody.data;
    // resumeData = resumeSchema.parse(requestBody.data);
  } catch (error) {
    logger.error(error);
    resumeError = JSON.stringify(error);
  }
  if (!resumeData) {
    return NextResponse.json(
      { error: "No JSON data provided", resumeError },
      { status: 400 }
    );
  }
  if (!apiKey) {
    return NextResponse.json({ error: "No apiKey provided" }, { status: 400 });
  }
  const fileUrl = await generateResumeImage(resumeData, apiKey);

  if (!fileUrl) {
    return NextResponse.json(
      {
        data: {
          url: null,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      data: {
        url: fileUrl,
      },
    },
    { status: 200 }
  );
}
