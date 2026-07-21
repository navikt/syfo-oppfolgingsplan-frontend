import "server-only";
import { logger } from "@navikt/next-logger";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import {
  fetchTiltakspakkeVurdering,
  ORGNUMMER_REGEX,
} from "./fetchTiltakspakkeVurdering";

//TODO fjern etter testing
function logFlaggskipetResultToConsole(result: {
  orgnummer: string;
  deltakelse?: string;
  erITiltaksgruppe: boolean;
  errorType?: string;
}) {
  console.info("[Flaggskipet] Tiltakspakke-vurdering", {
    tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
    ...result,
  });
}

export async function erOrgINavTiltaksgruppe(
  orgnummer: string,
): Promise<boolean> {
  if (!ORGNUMMER_REGEX.test(orgnummer)) {
    return false;
  }

  const result = await fetchTiltakspakkeVurdering(orgnummer);

  if (result.error) {
    logger.info(
      {
        orgnummer,
        tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        erITiltaksgruppe: false,
        errorType: result.error.type,
      },
      "Flaggskipet-vurdering feilet, lukker tiltakspakke-gate",
    );
    //TODO fjern etter testing
    logFlaggskipetResultToConsole({
      orgnummer,
      erITiltaksgruppe: false,
      errorType: result.error.type,
    });

    return false;
  }

  const tiltakspakke = result.data.find(
    (vurdering) => vurdering.tiltakspakkeId === OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
  );
  const virksomhet = tiltakspakke?.virksomheter.find(
    (it) => it.orgnummer === orgnummer,
  );

  const erITiltaksgruppe = virksomhet?.deltakelse === "TILTAKSGRUPPE";

  logger.info(
    {
      orgnummer,
      tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
      deltakelse: virksomhet?.deltakelse ?? "MANGLER",
      erITiltaksgruppe,
    },
    "Flaggskipet-vurdering hentet",
  );
  logFlaggskipetResultToConsole({
    orgnummer,
    deltakelse: virksomhet?.deltakelse ?? "MANGLER",
    erITiltaksgruppe,
  });

  return erITiltaksgruppe;
}
