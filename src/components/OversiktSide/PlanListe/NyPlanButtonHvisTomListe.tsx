import type { DemoScenario } from "@/common/demoScenario";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { LagNyOppfolgingsplanButton } from "./NyPlanButton";

export default async function NyPlanButtonHvisTomListe({
  narmesteLederId,
  scenario,
}: {
  narmesteLederId: string;
  scenario?: DemoScenario;
}) {
  const oversiktResult = await fetchOppfolgingsplanOversiktForAG(
    narmesteLederId,
    scenario,
  );

  if (oversiktResult.error) return null;

  const {
    userHasEditAccess,
    oversikt: { aktivPlan, tidligerePlaner, utkast },
  } = oversiktResult.data;

  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  return (
    harTomListe &&
    userHasEditAccess && (
      <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
    )
  );
}
