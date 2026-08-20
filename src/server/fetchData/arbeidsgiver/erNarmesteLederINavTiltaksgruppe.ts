import { cache } from "react";
import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/tiltakspakke/erOrgINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

/**
 * Cached med React cache() slik at flere server-komponenter kan spørre om
 * flagget i samme render-pass uten at Flaggskipet-vurderingen gjøres mer enn
 * én gang. Oversiktsfetchen er allerede cache()-wrappet og deles uansett.
 *
 * Flaggskipet-vurderingen gjøres alltid, også når feature-toggelen er av,
 * slik at Flaggskipet kan begynne å fordele brukere i prod før lansering.
 * Toggelen gater kun om resultatet tas i bruk i UI-et.
 */
export const erNarmesteLederINavTiltaksgruppe = cache(
  async (narmesteLederId: string): Promise<boolean> => {
    const oversiktResult =
      await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

    if (oversiktResult.error) {
      return false;
    }

    const erITiltaksgruppe = await erOrgINavTiltaksgruppe(
      oversiktResult.data.organization.orgNumber,
    );

    return isTiltakspakkevurderingFeatureToggleEnabled() && erITiltaksgruppe;
  },
);
