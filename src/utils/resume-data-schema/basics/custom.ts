import { z } from "zod";

export const customFieldSchema = z.object({
  id: z.string(),
  icon: z.string().optional(),
  name: z.string(),
  value: z.string(),
});

export type CustomField = z.infer<typeof customFieldSchema>;
