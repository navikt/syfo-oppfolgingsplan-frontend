import { Box, VStack } from "@navikt/ds-react";
import { isTiltakspakkevurderingFeatureToggleEnabled } from "@/env-variables/envHelpers";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { erOrgINavTiltaksgruppe } from "@/server/fetchData/tiltakspakke/erOrgINavTiltaksgruppe";
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
    employee,
    oversikt: { aktivPlan, tidligerePlaner, utkast },
  } = oversiktResult.data;

  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  if (!harTomListe || !userHasEditAccess) {
    return null;
  }

  const visUnntaksvalg =
    isTiltakspakkevurderingFeatureToggleEnabled() &&
    (await erOrgINavTiltaksgruppe(organization.orgNumber));

  if (!visUnntaksvalg) {
    return (
      <Box marginBlock="space-0 space-48">
        <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
      </Box>
    );
  }

  return (
    <VStack gap="space-32" marginBlock="space-0 space-32">
      <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
      <MeldUnntakSection ansattNavn={employee.name} />
    </VStack>
  );
}
