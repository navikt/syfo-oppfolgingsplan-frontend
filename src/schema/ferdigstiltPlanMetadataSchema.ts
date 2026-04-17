import z from "zod";

export const ferdigstiltPlanMetadataSchema = z.object({
  ferdigstiltTidspunkt: z.iso.datetime(),
  evalueringsDato: z.iso.date(),
  deltMedLegeTidspunkt: z.iso.datetime().nullable(),
  deltMedVeilederTidspunkt: z.iso.datetime().nullable(),
  stillingstittel: z.string().min(1).nullable(),
  stillingsprosent: z.number().nullable(),
});

export type FerdigstiltPlanMetadata = z.infer<
  typeof ferdigstiltPlanMetadataSchema
>;
