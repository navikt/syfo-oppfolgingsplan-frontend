import "server-only";
import { fetchOppfolgingsplanOversiktForAG } from "./fetchOppfolgingsplanOversikt";

/**
 * True when the employee has no plan at this virksomhet, across all sykefravær:
 * the backend overview does not separate them. Fails closed on fetch errors.
 */
export async function hasNoPlansInVirksomhet(
  narmesteLederId: string,
): Promise<boolean> {
  const oversikt = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);
  return (
    !oversikt.error &&
    oversikt.data.oversikt.aktivPlan === null &&
    oversikt.data.oversikt.tidligerePlaner.length === 0
  );
}
