import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { erOrgINavTiltaksgruppe } from "./erOrgINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

export async function erNarmesteLederINavTiltaksgruppe(
  narmesteLederId: string,
): Promise<boolean> {
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
}
