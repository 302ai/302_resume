import { env } from "@/env";
import { logger } from "@/utils";

import { Browser, connect } from "puppeteer";

export const getBrowser = async () => {
  const result: {
    browser: Browser | null;
    error: any;
  } = {
    browser: null,
    error: null,
  };
  const url = `${env.NEXT_PUBLIC_CHROME_URL}?token=${env.NEXT_PUBLIC_CHROME_TOKEN}`;
  try {
    result.browser = await connect({
      browserWSEndpoint: url,
      acceptInsecureCerts: true,
    });
  } catch (error) {
    logger.error(error);
    result.error = {
      error,
      url: url,
    };
  }
  return result;
};

export const ajaxUpload = async (file: File, apiKey: string) => {
  const result: {
    fileUrl: string | null;
    error: any;
  } = {
    fileUrl: null,
    error: null,
  };

  const formData = new FormData();
  formData.append("file", file);

  const url = `${env.NEXT_PUBLIC_API_PROXY_URL}/gpt/api/upload/gpt/image`;

  logger.info(
    "start uploading",
    file.name,
    (file.size / (1024 * 1024)).toFixed(2) + " MB",
    url,
    apiKey
  );
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    try {
      const msg = await response.json();
      result.fileUrl = msg.data.url;
    } catch (error) {
      result.error = error;
      logger.error("Upload failed");
    }
  }

  return result;
};
