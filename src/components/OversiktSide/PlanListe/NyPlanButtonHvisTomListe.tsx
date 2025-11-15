import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversiktForAG";
import { LagNyOppfolgingsplanButton } from "./NyPlanButton";

export default async function NyPlanButtonHvisTomListe({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const {
    aktivPlan: aktivPlan,
    tidligerePlaner: tidligerePlaner,
    utkast,
  } = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  return (
    harTomListe && (
      <LagNyOppfolgingsplanButton narmesteLederId={narmesteLederId} />
    )
  );
}
