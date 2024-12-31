import { z } from "zod";

import { defaultItem, itemSchema } from "../shared";

// Schema
export const interestSchema = itemSchema.extend({
  name: z.string(),
  keywords: z.array(z.string()).default([]),
});

// Type
export type Interest = z.infer<typeof interestSchema>;

// Defaults
export const defaultInterest: Interest = {
  ...defaultItem,
  name: "",
  keywords: [],
};
