import "server-only";
import { logger } from "@navikt/next-logger";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import { fetchTiltakspakkeVurdering } from "./fetchTiltakspakkeVurdering";

const FLAGGSKIPET_VURDERING_EVENT_TYPE = "flaggskipet_vurdering";

export async function erOrgINavTiltaksgruppe(
  orgnummer: string,
): Promise<boolean> {
  const result = await fetchTiltakspakkeVurdering(orgnummer);

  if (result.error) {
    logger.info(
      {
        event_type: FLAGGSKIPET_VURDERING_EVENT_TYPE,
        tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        erITiltaksgruppe: false,
        errorType: result.error.type,
      },
      FLAGGSKIPET_VURDERING_EVENT_TYPE,
    );

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
      event_type: FLAGGSKIPET_VURDERING_EVENT_TYPE,
      tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
      deltakelse: virksomhet?.deltakelse ?? "MANGLER",
      erITiltaksgruppe,
    },
    FLAGGSKIPET_VURDERING_EVENT_TYPE,
  );

  return erITiltaksgruppe;
}
