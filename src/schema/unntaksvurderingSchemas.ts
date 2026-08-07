import { z } from "zod";
import { organizationDetailsSchema } from "./organizationDetailsSchema";

/**
 * UnntaksvurderingMetadata fra backend-oversikten: arbeidsgivers melding om at
 * oppfølgingsplan ikke er aktuell nå. Ingen årsak eller fritekst — kun hvem og når.
 */
export const unntaksvurderingMetadataSchema = z.object({
  id: z.string(),
  meldtTidspunkt: z.iso.datetime(),
  meldtAv: z.object({
    /** Null hvis backend ikke fikk slått opp navnet i PDL. */
    navn: z.string().nullable(),
    // Kontrakten har kun ARBEIDSGIVER i dag; holdes som string så et
    // fremtidig additivt rollealternativ ikke velter hele oversikt-parsingen.
    rolle: z.string(),
  }),
  organization: organizationDetailsSchema,
});

export type UnntaksvurderingMetadata = z.infer<
  typeof unntaksvurderingMetadataSchema
>;

/**
 * Backend-beregnet gjeldende tilstand for arbeidsforholdet.
 * Presedens: AKTIV_PLAN > UTKAST > IKKE_AKTUELT > INGEN.
 */
export const gjeldendeStatusSchema = z.enum([
  "AKTIV_PLAN",
  "UTKAST",
  "IKKE_AKTUELT",
  "INGEN",
]);

export type GjeldendeStatus = z.infer<typeof gjeldendeStatusSchema>;
