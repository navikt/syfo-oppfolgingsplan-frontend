import { z } from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";
import { ferdigstiltPlanMetadataSchema } from "./ferdigstiltPlanMetadataSchema";
import { organizationDetailsSchema } from "./organizationDetailsSchema";
import { utkastMetadataSchema } from "./utkastMetadataSchema";

const ferdigstiltPlanIdAndMetadataSchema = z.object({
  id: z.string(),
  ...ferdigstiltPlanMetadataSchema.shape,
});

const ferdigstiltPlanIdMetadataAndOrgSchema = z.object({
  id: z.string(),
  ...ferdigstiltPlanMetadataSchema.shape,
  organization: organizationDetailsSchema,
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

export const OppfolgingsplanerOversiktResponseSchemaForSM = z.object({
  aktiveOppfolgingsplaner: z
    .array(ferdigstiltPlanIdMetadataAndOrgSchema)
    .nullable(),
  tidligerePlaner: z.array(ferdigstiltPlanIdMetadataAndOrgSchema),
});

export type OppfolgingsplanerOversiktForSM = z.infer<
  typeof OppfolgingsplanerOversiktResponseSchemaForSM
>;
