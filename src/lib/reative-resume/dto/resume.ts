// import { defaultResumeData, idSchema, resumeDataSchema } from "@reactive-resume/schema";

// import { userSchema } from "../user";
import { z } from "zod";
import { idSchema } from "../schema/shared";
import { defaultResumeData } from "@/utils/resume-data-schema";
import { resumeDataSchema } from "@/utils/resume-data-schema";

export const resumeSchema = z.object({
  id: idSchema,
  title: z.string(),
  slug: z.string(),
  data: resumeDataSchema.default(defaultResumeData),
  visibility: z.enum(["private", "public"]).default("private"),
  locked: z.boolean().default(false),
  userId: z.string(),
  // user: userSchema.optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  coverUrl: z.string().optional(),
});

// Type
export type ResumeSchemaData = z.infer<typeof resumeSchema>;
