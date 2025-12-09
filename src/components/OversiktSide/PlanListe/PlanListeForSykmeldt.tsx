import { VStack } from "@navikt/ds-react";
import {
  getSMAktivPlanHref,
  getSMTidligerePlanHref,
} from "@/common/route-hrefs";
import { IngenAktivPlanAlert } from "@/components/OversiktSide/IngenAktivPlanAlert";
import { fetchOppfolgingsplanOversiktForSM } from "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import PlanListeDel from "./PlanListeDel";

export default async function PlanListeForSykmeldt() {
  const { aktiveOppfolgingsplaner, tidligerePlaner } =
    await fetchOppfolgingsplanOversiktForSM();

  const harAktivePlaner = aktiveOppfolgingsplaner.length > 0;
  const harTidligerePlaner = tidligerePlaner.length > 0;

  return (
    <section className="mb-12">
      {!harAktivePlaner && <IngenAktivPlanAlert />}

      {harAktivePlaner && (
        <PlanListeDel>
          <VStack gap="4">
            {aktiveOppfolgingsplaner.map((plan) => (
              <AktivPlanLinkCard
                key={plan.id}
                aktivPlan={plan}
                linkCardTitle={
                  plan.organization.orgName ?? plan.organization.orgNumber
                }
                href={getSMAktivPlanHref(plan.id)}
              />
            ))}
          </VStack>
        </PlanListeDel>
      )}

      {harTidligerePlaner && (
        <PlanListeDel heading="Tidligere planer">
          <VStack gap="4">
            {tidligerePlaner.map((plan) => (
              <TidligerePlanLinkCard
                key={plan.id}
                tidligerePlan={plan}
                linkCardTitle={
                  plan.organization.orgName ?? plan.organization.orgNumber
                }
                href={getSMTidligerePlanHref(plan.id)}
              />
            ))}
          </VStack>
        </PlanListeDel>
      )}
    </section>
  );
}
