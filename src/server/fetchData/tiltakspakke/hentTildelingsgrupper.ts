import "server-only";
import { logger } from "@navikt/next-logger";
import {
  TILTAKSPAKKE_IDER,
  type TiltakspakkeId,
} from "@/schema/flaggskipetSchemas";
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
 * Reads every known tiltakspakke from one Flaggskipet response.
 * Organisations missing from a tiltakspakke stay "ukjent".
 */
export async function hentTildelingsgrupper(
  orgnumre: Iterable<string>,
): Promise<Readonly<Record<TiltakspakkeId, Tildelinger>>> {
  const unikeOrgnumre = [...new Set(orgnumre)];
  const tildelingerPerPakke = Object.fromEntries(
    TILTAKSPAKKE_IDER.map((id) => [
      id,
      new Map<string, Tildelingsgruppe>(
        unikeOrgnumre.map((orgnummer) => [orgnummer, "ukjent"]),
      ),
    ]),
  ) as Record<TiltakspakkeId, Map<string, Tildelingsgruppe>>;
  if (unikeOrgnumre.length === 0) return tildelingerPerPakke;

  const result = await fetchTiltakspakkeVurdering(unikeOrgnumre);
  for (const tiltakspakkeId of TILTAKSPAKKE_IDER) {
    const tildelinger = tildelingerPerPakke[tiltakspakkeId];
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
