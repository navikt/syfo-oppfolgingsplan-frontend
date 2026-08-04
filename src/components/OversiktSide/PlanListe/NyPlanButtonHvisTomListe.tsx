import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { LagNyOppfolgingsplanButton } from "./NyPlanButton";

async function loggTiltakspakkevurderingIObservasjonsmodus(orgnummer: string) {
  // Frem til UI-et i #891 faktisk bruker returverdien, kalles predikatet kun
  // for den strukturerte loggingen i erOrgINavTiltaksgruppe.
  await erOrgINavTiltaksgruppe(orgnummer);
}

export default async function NyPlanButtonHvisTomListe({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const oversiktResult =
    await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  if (oversiktResult.error) return null;

  const {
    userHasEditAccess,
    organization,
    oversikt: { aktivPlan, tidligerePlaner, utkast },
  } = oversiktResult.data;

  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  if (!harTomListe || !userHasEditAccess) {
    return null;
  }

  if (isTiltakspakkevurderingFeatureToggleEnabled()) {
    await loggTiltakspakkevurderingIObservasjonsmodus(organization.orgNumber);
  }

  return <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />;
}
