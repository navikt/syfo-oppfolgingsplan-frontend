import { InlineMessage, VStack } from "@navikt/ds-react";
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
  // Backend derives aktiveOppfolgingsplaner and tidligerePlaner from the same sorted plan lists per employer.
  // If tidligerePlaner exists, an active/newest plan also exists.

  return (
    <section className="mb-12">
      {!harAktivePlaner && <IngenAktivPlanAlert />}
      {harAktivePlaner && (
        <InlineMessage status="info" size="small" className="mb-4">
          Aktive og tidligere oppfølgingsplaner blir utilgjengelige når du ikke
          har hatt sykmelding hos arbeidsgiveren på 6 måneder. Åpne planen og
          velg «Vis PDF» for å lagre en kopi.
        </InlineMessage>
      )}
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
