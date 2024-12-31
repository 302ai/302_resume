/* eslint-disable camelcase */
import { env } from "@/env";
import { logger } from "@/utils";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";
export const runtime = "edge";

const getPrompt = (content: string) => {
  return `
You are a helpful assistant which can help user to enhance their resume.
Following is the context of the resume in JSON format:
\`\`\`json
${content}
\`\`\`
You will reply in detail and be friendly and patient.
You always use the language as same as user sent.
  `;
};

export async function POST(req: Request) {
  const { content, record, apiKey, model } = await req.json();

  const fetchUrl = `${env.NEXT_PUBLIC_API_URL}/v1`;
  const openai = new OpenAI({ apiKey: apiKey, baseURL: fetchUrl });

  const prompt = getPrompt(content);
  try {
    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [{ role: "system", content: prompt }, ...record],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    logger.error("=============", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "error" in error &&
      "status" in error &&
      typeof error.status === "number"
    ) {
      return NextResponse.json(error.error, { status: error.status });
    }

    return NextResponse.json(error, { status: 500 });
  }
}
