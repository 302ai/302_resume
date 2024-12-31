import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

export const idSchema = z
  .string()
  .default(createId())
  .describe("Unique identifier for the item in Cuid2 format");
