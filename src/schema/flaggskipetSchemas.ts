import { z } from "zod";

export const OPPFOLGINGSPLAN_TILTAKSPAKKE_1 = "OPPFOLGINGSPLAN_TILTAKSPAKKE_1";
export const DIALOGMOTE_TILTAKSPAKKE_2 = "DIALOGMOTE_TILTAKSPAKKE_2";
export const TILTAKSPAKKE_IDER = [
  OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
  DIALOGMOTE_TILTAKSPAKKE_2,
] as const;
export type TiltakspakkeId = (typeof TILTAKSPAKKE_IDER)[number];

export const deltakelseSchema = z.enum([
  "TILTAKSGRUPPE",
  "KONTROLLGRUPPE",
  "UTENFOR_SCOPE",
]);

export const flaggskipetVurderingResponseSchema = z.array(
  z.object({
    tiltakspakkeId: z.string(),
    virksomheter: z.array(
      z.object({
        orgnummer: z.string(),
        deltakelse: deltakelseSchema,
      }),
    ),
  }),
);

export type FlaggskipetVurderingResponse = z.infer<
  typeof flaggskipetVurderingResponseSchema
>;
