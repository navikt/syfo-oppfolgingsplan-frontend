import { Box } from "@navikt/ds-react";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import NyPlanOgUnntak from "../MeldUnntak/NyPlanOgUnntak";
import { LagNyOppfolgingsplanButton } from "./NyPlanButton";

export default async function NyPlanButtonHvisTomListe({
  narmesteLederId,
  erITiltaksgruppe,
}: {
  narmesteLederId: string;
  erITiltaksgruppe: boolean;
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
    <NyPlanOgUnntak
      key={narmesteLederId}
      narmesteLederId={narmesteLederId}
      ansattNavn={employee.name}
    />
  );
}
