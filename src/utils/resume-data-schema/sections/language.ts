import { z } from "zod";

import { defaultItem, itemSchema } from "../shared";

// Schema
export const languageSchema = itemSchema.extend({
  name: z.string(),
  description: z.string(),
  level: z.union([z.number().min(0).max(5).default(1), z.string()]),
});

// Type
export type Language = z.infer<typeof languageSchema>;

// Defaults
export const defaultLanguage: Language = {
  ...defaultItem,
  name: "",
  description: "",
  level: 1,
};
