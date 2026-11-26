import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import NyPlanOgUnntak from "../MeldUnntak/NyPlanOgUnntak";

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
    employee,
    oversikt: { aktivPlan, tidligerePlaner, utkast },
  } = oversiktResult.data;

  const harTomListe =
    aktivPlan === null && tidligerePlaner.length === 0 && utkast === null;

  if (!harTomListe || !userHasEditAccess) {
    return null;
  }

  return (
    <NyPlanOgUnntak
      key={narmesteLederId}
      narmesteLederId={narmesteLederId}
      ansattNavn={employee.name}
    />
  );
}
