import { Json } from "@/utils/resume-data-namespace/src/types";
import { Schema } from "zod";

import { Parser } from "../interfaces/parser";
import { resumeDataSchema } from "@/utils/resume-data-schema";
import { ResumeData } from "@/utils/resume-data-schema";

export class ReactiveResumeParser implements Parser<Json, ResumeData> {
  schema: Schema;

  constructor() {
    this.schema = resumeDataSchema;
  }

  readFile(file: File): Promise<Json> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const result = JSON.parse(reader.result as string) as Json;
          resolve(result);
        } catch {
          reject(new Error("Failed to parse JSON"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read the file"));
      };

      reader.readAsText(file);
    });
  }

  validate(data: Json) {
    return this.schema.parse(data) as ResumeData;
  }

  convert(data: ResumeData) {
    return data;
  }
}
