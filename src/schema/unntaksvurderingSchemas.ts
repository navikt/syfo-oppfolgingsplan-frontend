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

/**
 * Sykmeldt-varianten bærer et backend-beregnet gjeldende-flagg per element:
 * maksimalt én gjeldende vurdering per organisasjon, og bare når vurderingen
 * er nyere enn siste ferdigstilte plan for samme organisasjon.
 */
export const sykmeldtUnntaksvurderingSchema =
  unntaksvurderingMetadataSchema.extend({
    gjeldende: z.boolean(),
  });

export type SykmeldtUnntaksvurdering = z.infer<
  typeof sykmeldtUnntaksvurderingSchema
>;

export const gjeldendeStatusSchema = z.enum([
  "AKTIV_PLAN",
  "UTKAST",
  "IKKE_AKTUELT",
  "INGEN",
]);
