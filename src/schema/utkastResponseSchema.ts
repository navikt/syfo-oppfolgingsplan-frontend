import z from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";

// TODO
const UtkastContentSchema = z.record(z.string(), z.string());

const utkastSchema = z.object({
  content: UtkastContentSchema,
  sistLagretTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString)),
});

export const utkastResponseForAGSchema = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  utkast: utkastSchema.nullable(),
});

export type FerdigstiltPlanResponseForAG = z.infer<
  typeof utkastResponseForAGSchema
>;
