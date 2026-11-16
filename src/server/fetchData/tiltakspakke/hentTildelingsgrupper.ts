import "server-only";
import { logger } from "@navikt/next-logger";
import type { Tildelingsgruppe } from "@/schema/tiltakspakkeContext";
import { fetchTiltakspakkeVurdering } from "./fetchTiltakspakkeVurdering";

const FLAGGSKIPET_VURDERING_EVENT_TYPE = "flaggskipet_vurdering";
const grupper = {
  TILTAKSGRUPPE: "tiltak",
  KONTROLLGRUPPE: "kontroll",
  UTENFOR_SCOPE: "utenfor_scope",
} as const;

export type Tildelinger = ReadonlyMap<string, Tildelingsgruppe>;

/**
 * Reads every requested tiltakspakke from one Flaggskipet response.
 * Organisations missing from a tiltakspakke stay "ukjent".
 */
export async function hentTildelingsgrupper<Id extends string>(
  orgnumre: Iterable<string>,
  tiltakspakkeIder: readonly Id[],
): Promise<ReadonlyMap<Id, Tildelinger>> {
  const unikeOrgnumre = [...new Set(orgnumre)];
  const tildelingerPerPakke = new Map(
    tiltakspakkeIder.map((id) => [
      id,
      new Map<string, Tildelingsgruppe>(
        unikeOrgnumre.map((orgnummer) => [orgnummer, "ukjent"]),
      ),
    ]),
  );
  if (unikeOrgnumre.length === 0) return tildelingerPerPakke;

  const result = await fetchTiltakspakkeVurdering(unikeOrgnumre);
  for (const [tiltakspakkeId, tildelinger] of tildelingerPerPakke) {
    if (result.error) {
      // TokenX owns the terminal error log; this records the fail-closed outcome.
      logger.info(
        {
          event_type: FLAGGSKIPET_VURDERING_EVENT_TYPE,
          tiltakspakkeId,
          antallVirksomheter: unikeOrgnumre.length,
          errorType: result.error.type,
        },
        FLAGGSKIPET_VURDERING_EVENT_TYPE,
      );
      continue;
    }

    const tiltakspakke = result.data.find(
      (vurdering) => vurdering.tiltakspakkeId === tiltakspakkeId,
    );
    for (const virksomhet of tiltakspakke?.virksomheter ?? []) {
      if (tildelinger.has(virksomhet.orgnummer)) {
        tildelinger.set(virksomhet.orgnummer, grupper[virksomhet.deltakelse]);
      }
    }

    logger.info(
      {
        event_type: FLAGGSKIPET_VURDERING_EVENT_TYPE,
        tiltakspakkeId,
        antallVirksomheter: unikeOrgnumre.length,
        antallITiltaksgruppe: [...tildelinger.values()].filter(
          (gruppe) => gruppe === "tiltak",
        ).length,
      },
      FLAGGSKIPET_VURDERING_EVENT_TYPE,
    );
  }
  return tildelingerPerPakke;
}
