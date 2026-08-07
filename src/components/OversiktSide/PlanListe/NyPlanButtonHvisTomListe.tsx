import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import MeldUnntakSection from "../MeldUnntak/MeldUnntakSection";
import { LagNyOppfolgingsplanButton } from "./NyPlanButton";

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

  // Gates kun på plan-listene — meldte unntaksvurderinger skal IKKE inn her.
  // Både hovedvalget og unntaksvalget skal bestå etter et meldt unntak (#891).
  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  if (!harTomListe || !userHasEditAccess) {
    return null;
  }

  const visUnntaksvalg =
    isTiltakspakkevurderingFeatureToggleEnabled() &&
    (await erOrgINavTiltaksgruppe(organization.orgNumber));

  return (
    <>
      <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
      {visUnntaksvalg && <MeldUnntakSection />}
    </>
  );
}
