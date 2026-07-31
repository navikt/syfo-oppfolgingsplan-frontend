import { VStack } from "@navikt/ds-react";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erOrgINavTiltaksgruppe";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { BehovsvurderingLokalDemo } from "../Behovsvurdering/BehovsvurderingLokalDemo";
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

  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  if (!harTomListe || !userHasEditAccess) {
    return null;
  }

  const orgErITiltaksgruppe =
    isLocalOrDemo && (await erOrgINavTiltaksgruppe(organization.orgNumber));

  if (!orgErITiltaksgruppe) {
    return <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />;
  }

  return (
    <VStack gap="space-12">
      <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
      <BehovsvurderingLokalDemo />
    </VStack>
  );
}
