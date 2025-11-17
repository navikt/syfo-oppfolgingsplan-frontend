import { z } from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";

export const utkastMetadataSchema = z.object({
  sistLagretTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString)),
});

export type UtkastMetadata = z.infer<typeof utkastMetadataSchema>;

export const oppfolgingsplanMetadataSchema = z.object({
  id: z.string(),
  opprettetTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString)),
  evalueringsDato: z.iso.date().transform((dateString) => new Date(dateString)),
  deltMedLegeTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString))
    .nullable(),
  deltMedVeilederTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString))
    .nullable(),
});

export type OppfolgingsplanMetadata = z.infer<
  typeof oppfolgingsplanMetadataSchema
>;

export const OppfolgingsplanerOversiktResponseSchemaForAG = z.object({
  ...commonResponseFieldsForAGSchema.shape,
  oversikt: z.object({
    utkast: utkastMetadataSchema.nullable(),
    aktivPlan: oppfolgingsplanMetadataSchema.nullable(),
    tidligerePlaner: z.array(oppfolgingsplanMetadataSchema),
  }),
});

export type OppfolgingsplanerOversiktForAG = z.infer<
  typeof OppfolgingsplanerOversiktResponseSchemaForAG
>;
