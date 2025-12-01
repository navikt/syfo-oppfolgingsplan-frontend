import { VStack } from "@navikt/ds-react";
import AktivPlanLinkCard from "@/common/components/PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "@/common/components/PlanLinkCard/TidligerePlanLinkCard";
import PlanListeDel from "@/common/components/PlanListeDel";
import {
  getSMAktivPlanHref,
  getSMTidligerePlanHref,
} from "@/common/route-hrefs";
import { fetchOppfolgingsplanOversiktForSM } from "@/server/fetchData/sykmeldt/fetchOppfolgingsplanOversiktForSM";
import { IngenAktivPlanAlert } from "./IngenAktivPlanAlert";

export default async function PlanListeForSykmeldt() {
  const { aktiveOppfolgingsplaner, tidligerePlaner } =
    await fetchOppfolgingsplanOversiktForSM();

  const harAktivePlaner =
    aktiveOppfolgingsplaner && aktiveOppfolgingsplaner.length > 0;
  const harTidligerePlaner = tidligerePlaner.length > 0;

  return (
    <section className="mb-12">
      {!harAktivePlaner && <IngenAktivPlanAlert />}

      {harAktivePlaner && (
        <PlanListeDel heading="Aktive planer">
          {aktiveOppfolgingsplaner.map((plan) => (
            <AktivPlanLinkCard
              key={plan.id}
              aktivPlan={plan}
              arbeidsstedNavn={
                plan.organization.orgName ?? plan.organization.orgNumber
              }
              href={getSMAktivPlanHref(plan.id)}
            />
          ))}
        </PlanListeDel>
      )}

      {harTidligerePlaner && (
        <PlanListeDel heading="Tidligere planer">
          <VStack gap="4">
            {tidligerePlaner.map((plan) => (
              <TidligerePlanLinkCard
                key={plan.id}
                tidligerePlan={plan}
                arbeidsstedNavn={
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
