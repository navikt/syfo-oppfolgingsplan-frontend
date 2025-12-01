import { z } from "zod";
import { commonResponseFieldsSchema } from "./commonResponseFieldsSchemas";
import { ferdigstiltPlanMetadataSchema } from "./ferdigstiltPlanMetadataSchema";
import { organizationDetailsSchema } from "./organizationDetailsSchema";
import { utkastMetadataSchema } from "./utkastMetadataSchema";

/**
 * OppfolgingsplanMetadata fra backend - brukes i oversikt-responsene.
 * Inkluderer organization per plan (i motsetning til ferdigstilt plan-responsen
 * hvor organization er på toppnivå).
 */
const oppfolgingsplanMetadataSchema = z.object({
  id: z.string(),
  ...ferdigstiltPlanMetadataSchema.shape,
  organization: organizationDetailsSchema,
});

export const OppfolgingsplanerOversiktResponseSchemaForAG = z.object({
  ...commonResponseFieldsSchema.shape,
  oversikt: z.object({
    utkast: utkastMetadataSchema.nullable(),
    aktivPlan: oppfolgingsplanMetadataSchema.nullable(),
    tidligerePlaner: z.array(oppfolgingsplanMetadataSchema),
  }),
});

export type OppfolgingsplanerOversiktForAG = z.infer<
  typeof OppfolgingsplanerOversiktResponseSchemaForAG
>;

export const OppfolgingsplanerOversiktResponseSchemaForSM = z.object({
  aktiveOppfolgingsplaner: z.array(oppfolgingsplanMetadataSchema),
  tidligerePlaner: z.array(oppfolgingsplanMetadataSchema),
});

export type OppfolgingsplanerOversiktForSM = z.infer<
  typeof OppfolgingsplanerOversiktResponseSchemaForSM
>;
