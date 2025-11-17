import z from "zod";

export const ferdigstiltPlanMetadataSchema = z.object({
  ferdigstiltTidspunkt: z.iso
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

export type FerdigstiltPlanMetadata = z.infer<
  typeof ferdigstiltPlanMetadataSchema
>;
