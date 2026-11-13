import "server-only";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

export async function isFirstPlan(narmesteLederId: string): Promise<boolean> {
  const oversikt = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);
  return (
    !oversikt.error &&
    oversikt.data.oversikt.aktivPlan === null &&
    oversikt.data.oversikt.tidligerePlaner.length === 0
  );
}
