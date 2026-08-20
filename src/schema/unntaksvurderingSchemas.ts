import { z } from "zod";
import { organizationDetailsSchema } from "./organizationDetailsSchema";

export const meldtAvSchema = z.object({
  navn: z.string().nullable(),
  rolle: z.literal("ARBEIDSGIVER"),
});

export const unntaksvurderingMetadataSchema = z.object({
  id: z.string(),
  meldtTidspunkt: z.iso.datetime(),
  meldtAv: meldtAvSchema,
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
