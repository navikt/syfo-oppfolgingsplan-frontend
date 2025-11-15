import { array, object, string, z } from "zod";
import { commonResponseFieldsForAGSchema } from "./commonResponseFieldsSchemas";

export const utkastMetadataSchema = object({
  sistLagretTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString)),
});

export type UtkastMetadata = z.infer<typeof utkastMetadataSchema>;

export const oppfolgingsplanMetadataSchema = object({
  id: string(),
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

export const OppfolgingsplanerOversiktResponseSchemaForAG = object({
  ...commonResponseFieldsForAGSchema.shape,
  utkast: utkastMetadataSchema.nullable(),
  aktivPlan: oppfolgingsplanMetadataSchema.nullable(),
  tidligerePlaner: array(oppfolgingsplanMetadataSchema),
});

export type OppfolgingsplanerOversiktForAG = z.infer<
  typeof OppfolgingsplanerOversiktResponseSchemaForAG
>;
