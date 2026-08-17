import { Box, VStack } from "@navikt/ds-react";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import MeldUnntakSection from "../MeldUnntak/MeldUnntakSection";
import { LagNyOppfolgingsplanButton } from "./NyPlanButton";

export default async function NyPlanButtonHvisTomListe({
  narmesteLederId,
  erITiltaksgruppe = false,
}: {
  narmesteLederId: string;
  erITiltaksgruppe?: boolean;
}) {
  const oversiktResult =
    await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  if (oversiktResult.error) return null;

  const {
    userHasEditAccess,
    employee,
    oversikt: { aktivPlan, tidligerePlaner, utkast },
  } = oversiktResult.data;

  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  if (!harTomListe || !userHasEditAccess) {
    return null;
  }

  if (!erITiltaksgruppe) {
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
