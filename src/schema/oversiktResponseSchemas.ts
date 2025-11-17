import { z } from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";
import { ferdigstiltPlanMetadataSchema } from "./ferdigstiltPlanMetadataSchema";
import { utkastMetadataSchema } from "./utkastMetadataSchema";

const ferdigstiltPlanIdAndMetadataSchema = z.object({
  id: z.string(),
  ...ferdigstiltPlanMetadataSchema.shape,
});

export const OppfolgingsplanerOversiktResponseSchemaForAG = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  oversikt: z.object({
    utkast: utkastMetadataSchema.nullable(),
    aktivPlan: ferdigstiltPlanIdAndMetadataSchema.nullable(),
    tidligerePlaner: z.array(ferdigstiltPlanIdAndMetadataSchema),
  }),
});

export type OppfolgingsplanerOversiktForAG = z.infer<
  typeof OppfolgingsplanerOversiktResponseSchemaForAG
>;
