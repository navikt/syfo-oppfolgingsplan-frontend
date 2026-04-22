import { BodyShort, VStack } from "@navikt/ds-react";
import type { DemoScenario } from "@/common/demoScenario";
import {
  getSMAktivPlanHref,
  getSMTidligerePlanHref,
} from "@/common/route-hrefs";
import { IngenAktivPlanAlert } from "@/components/OversiktSide/IngenAktivPlanAlert";
import { fetchOppfolgingsplanOversiktForSM } from "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import PlanListeDel from "./PlanListeDel";

export default async function PlanListeForSykmeldt({
  scenario,
}: {
  scenario?: DemoScenario;
}) {
  const { aktiveOppfolgingsplaner, tidligerePlaner } =
    await fetchOppfolgingsplanOversiktForSM(scenario);

  const harAktivePlaner = aktiveOppfolgingsplaner.length > 0;
  const harTidligerePlaner = tidligerePlaner.length > 0;

  return (
    <section className="mb-12">
      {!harAktivePlaner && <IngenAktivPlanAlert />}
      {harAktivePlaner && (
        <PlanListeDel>
          <VStack gap="space-16">
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
        <PlanListeDel heading="Tidligere oppfølgingsplaner">
          <BodyShort size="small" textColor="subtle" className="mb-4">
            Tidligere planer er tilgjengelige i 4 måneder etter at du er
            friskmeldt.
          </BodyShort>
          <VStack gap="space-16">
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
