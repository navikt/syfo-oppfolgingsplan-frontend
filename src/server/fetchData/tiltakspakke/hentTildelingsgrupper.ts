import "server-only";
import { logger } from "@navikt/next-logger";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import type { Tildelingsgruppe } from "@/schema/tiltakspakkeContext";
import { fetchTiltakspakkeVurdering } from "./fetchTiltakspakkeVurdering";

const FLAGGSKIPET_VURDERING_EVENT_TYPE = "flaggskipet_vurdering";
const grupper = {
  TILTAKSGRUPPE: "tiltak",
  KONTROLLGRUPPE: "kontroll",
  UTENFOR_SCOPE: "utenfor_scope",
} as const;

/** Preserve assignment from the same response used for UI gating. */
export async function hentTildelingsgrupper(
  orgnumre: Iterable<string>,
): Promise<ReadonlyMap<string, Tildelingsgruppe>> {
  const unikeOrgnumre = [...new Set(orgnumre)];
  const tildelinger = new Map<string, Tildelingsgruppe>(
    unikeOrgnumre.map((orgnummer) => [orgnummer, "ukjent"]),
  );
  if (unikeOrgnumre.length === 0) return tildelinger;

  const result = await fetchTiltakspakkeVurdering(unikeOrgnumre);
  if (result.error) {
    // TokenX owns the terminal error log; this records the fail-closed outcome.
    logger.info(
      {
        event_type: FLAGGSKIPET_VURDERING_EVENT_TYPE,
        tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        antallVirksomheter: unikeOrgnumre.length,
        errorType: result.error.type,
      },
      FLAGGSKIPET_VURDERING_EVENT_TYPE,
    );
    return tildelinger;
  }

  const tiltakspakke = result.data.find(
    (vurdering) => vurdering.tiltakspakkeId === OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
  );
  for (const virksomhet of tiltakspakke?.virksomheter ?? []) {
    if (tildelinger.has(virksomhet.orgnummer)) {
      tildelinger.set(virksomhet.orgnummer, grupper[virksomhet.deltakelse]);
    }
  }

  logger.info(
    {
      event_type: FLAGGSKIPET_VURDERING_EVENT_TYPE,
      tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
      antallVirksomheter: unikeOrgnumre.length,
      antallITiltaksgruppe: [...tildelinger.values()].filter(
        (gruppe) => gruppe === "tiltak",
      ).length,
    },
    FLAGGSKIPET_VURDERING_EVENT_TYPE,
  );
  return tildelinger;
}
