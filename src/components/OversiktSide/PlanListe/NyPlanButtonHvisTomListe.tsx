import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
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
