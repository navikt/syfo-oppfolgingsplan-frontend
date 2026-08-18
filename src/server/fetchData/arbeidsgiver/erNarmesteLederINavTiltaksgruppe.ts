import { cache } from "react";
import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { erOrgINavTiltaksgruppe } from "./erOrgINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

/**
 * Cached med React cache() slik at flere server-komponenter kan spørre om
 * flagget i samme render-pass uten at Flaggskipet-vurderingen gjøres mer enn
 * én gang. Oversiktsfetchen er allerede cache()-wrappet og deles uansett.
 */
export const erNarmesteLederINavTiltaksgruppe = cache(
  async (narmesteLederId: string): Promise<boolean> => {
    if (!isTiltakspakkevurderingFeatureToggleEnabled()) {
      return false;
    }

    const oversiktResult =
      await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

    if (oversiktResult.error) {
      return false;
    }

    return await erOrgINavTiltaksgruppe(
      oversiktResult.data.organization.orgNumber,
    );
  },
);
