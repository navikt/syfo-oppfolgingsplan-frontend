import z from "zod";

export const ferdigstiltPlanMetadataSchema = z.object({
  ferdigstiltTidspunkt: z.iso.datetime(),
  evalueringsDato: z.iso.date(),
  deltMedLegeTidspunkt: z.iso.datetime().nullable(),
  deltMedVeilederTidspunkt: z.iso.datetime().nullable(),
});

export type FerdigstiltPlanMetadata = z.infer<
  typeof ferdigstiltPlanMetadataSchema
>;
