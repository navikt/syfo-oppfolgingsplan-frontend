import "server-only";
import { logger } from "@navikt/next-logger";
import { OPPFOLGINGSPLAN_TILTAKSPAKKE_1 } from "@/schema/flaggskipetSchemas";
import { fetchTiltakspakkeVurdering } from "./fetchTiltakspakkeVurdering";

const FLAGGSKIPET_VURDERING_EVENT_TYPE = "flaggskipet_vurdering";

export async function finnOrganisasjonerITiltaksgruppe(
  orgnumre: Iterable<string>,
): Promise<ReadonlySet<string>> {
  const unikeOrgnumre = [...new Set(orgnumre)];
  if (unikeOrgnumre.length === 0) return new Set();

  const result = await fetchTiltakspakkeVurdering(unikeOrgnumre);
  if (result.error) {
    // TokenX owns the single terminal error log. This separate info event
    // records the user-visible fail-closed business outcome and aggregate counts.
    logger.info(
      {
        event_type: FLAGGSKIPET_VURDERING_EVENT_TYPE,
        tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
        antallVirksomheter: unikeOrgnumre.length,
        errorType: result.error.type,
      },
      FLAGGSKIPET_VURDERING_EVENT_TYPE,
    );
    return new Set();
  }

  const etterspurteOrgnumre = new Set(unikeOrgnumre);
  const tiltakspakke = result.data.find(
    (vurdering) => vurdering.tiltakspakkeId === OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
  );
  const organisasjonerITiltaksgruppe = new Set(
    tiltakspakke?.virksomheter
      .filter(
        (virksomhet) =>
          etterspurteOrgnumre.has(virksomhet.orgnummer) &&
          virksomhet.deltakelse === "TILTAKSGRUPPE",
      )
      .map((virksomhet) => virksomhet.orgnummer) ?? [],
  );

  logger.info(
    {
      event_type: FLAGGSKIPET_VURDERING_EVENT_TYPE,
      tiltakspakkeId: OPPFOLGINGSPLAN_TILTAKSPAKKE_1,
      antallVirksomheter: unikeOrgnumre.length,
      antallITiltaksgruppe: organisasjonerITiltaksgruppe.size,
    },
    FLAGGSKIPET_VURDERING_EVENT_TYPE,
  );

  return organisasjonerITiltaksgruppe;
}
