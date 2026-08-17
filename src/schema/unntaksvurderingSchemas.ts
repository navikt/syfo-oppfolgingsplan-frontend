import { z } from "zod";
import { organizationDetailsSchema } from "./organizationDetailsSchema";

export const unntaksvurderingMetadataSchema = z.object({
  id: z.string(),
  meldtTidspunkt: z.iso.datetime(),
  meldtAv: z.object({
    navn: z.string().nullable(),
    rolle: z.literal("ARBEIDSGIVER"),
  }),
  organization: organizationDetailsSchema,
});

export type UnntaksvurderingMetadata = z.infer<
  typeof unntaksvurderingMetadataSchema
>;

export const gjeldendeStatusSchema = z.enum([
  "AKTIV_PLAN",
  "UTKAST",
  "IKKE_AKTUELT",
  "INGEN",
]);
