/* eslint-disable @typescript-eslint/no-unused-vars */
import { ResumeData, resumeDataSchema } from "../resume-data-schema";
import { z } from "zod";
import getSections from "./get-sections";

const parseDataToResumePart = <T extends z.ZodRawShape>(
  defaultData: z.infer<typeof schema>,
  schema: z.ZodObject<T>,
  unknowData: unknown,
  parentKey?: string | number | symbol
): z.infer<typeof schema> => {
  const result: z.infer<z.ZodObject<T>> = {
    ...defaultData,
  };

  if (!schema.shape) {
    return result;
  }

  // 获取keys
  const keys = Object.keys(schema.shape) as (keyof T)[];

  if (typeof unknowData !== "object" || unknowData === null) {
    return result;
  }

  // 开始

  keys.forEach((key) => {
    const item = (unknowData as Record<keyof T, unknown>)[key];

    const itemParse = schema.shape[key].safeParse(item);

    if (itemParse.success) {
      // console.log(parentKey+`.${String(key)}`, result, unknowData, "success");
      result[key] = itemParse.data;
    } else {
      if (!defaultData[key] || !schema.shape[key]) {
        return;
      }

      const subDefaultdata = defaultData[key] as any;
      const subSchema = schema.shape[key] as any;

      // Array
      if (subSchema instanceof z.ZodArray) {
        const subSchemaObject = subSchema.element;
        let subData: z.infer<typeof subSchemaObject>[] = [];
        if (Array.isArray(item)) {
          subData = item.map((itemObject) =>
            parseDataToResumePart(
              subDefaultdata,
              subSchemaObject,
              itemObject,
              `${parentKey ? `${String(parentKey)}.` : ""}${String(key)}`
            )
          );
          result[key] = subData as any;
        }
      }
      // Object
      else if (subSchema instanceof z.ZodObject) {
        const subData = parseDataToResumePart(
          subDefaultdata,
          subSchema,
          item,
          `${parentKey ? `${String(parentKey)}.` : ""}${String(key)}`
        );
        result[key] = subData as any;
      }
    }
  });

  return result;
};

export const parseDataToResume = (
  defaultData: ResumeData,
  unknowData: unknown
) => {
  const result = parseDataToResumePart(
    defaultData,
    resumeDataSchema,
    unknowData
  );

  result.metadata = defaultData.metadata;

  result.basics.picture = defaultData.basics.picture;

  if (
    typeof unknowData === "object" &&
    unknowData !== null &&
    "sections" in unknowData
  ) {
    result.sections = getSections(defaultData.sections, unknowData.sections);
  }

  console.log(result);
  return result;
};
