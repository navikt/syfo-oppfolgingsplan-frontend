import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { LagNyOppfolgingsplanButton } from "./NyPlanButton";

export default async function NyPlanButtonHvisTomListe({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const {
    userHasEditAccess,
    oversikt: { aktivPlan, tidligerePlaner, utkast },
  } = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  return (
    harTomListe &&
    userHasEditAccess && (
      <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
    )
  );
}
