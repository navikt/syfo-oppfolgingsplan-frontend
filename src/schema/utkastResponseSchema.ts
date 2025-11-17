import z from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";
import { utkastMetadataSchema } from "./utkastMetadataSchema";

// TODO
const UtkastContentSchema = z.record(z.string(), z.string());

const utkastSchema = z.object({
  ...utkastMetadataSchema.shape,
  content: UtkastContentSchema,
});

export const utkastResponseForAGSchema = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  utkast: utkastSchema.nullable(),
});

export type FerdigstiltPlanResponseForAG = z.infer<
  typeof utkastResponseForAGSchema
>;
