import { BodyShort, VStack } from "@navikt/ds-react";
import type { DemoScenario } from "@/common/demoScenario";
import {
  getAGAktivPlanHref,
  getAGTidligerePlanHref,
} from "@/common/route-hrefs";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import UtkastLinkPanel from "./PlanLinkCard/UtkastLinkCard";
import PlanListeDel from "./PlanListeDel";
import { SlettUtkastButtonAndModal } from "./SlettUtkast/SlettUtkastButtonAndModal";

interface Props {
  narmesteLederId: string;
  scenario?: DemoScenario;
}

export default async function PlanListeForArbeidsgiver({
  narmesteLederId,
  scenario,
}: Props) {
  const oversiktResult = await fetchOppfolgingsplanOversiktForAG(
    narmesteLederId,
    scenario,
  );

  if (oversiktResult.error) {
    return (
      <section className="mb-12">
        <FetchErrorAlert error={oversiktResult.error} />
      </section>
    );
  }

  const {
    organization: { orgName },
    oversikt: { aktivPlan, tidligerePlaner, utkast },
  } = oversiktResult.data;

  const harTidligerePlaner = tidligerePlaner.length > 0;

  const linkCardTitle = orgName || "Oppfølgingsplan";

  return (
    <section className="mb-12">
      {aktivPlan && (
        <PlanListeDel>
          <AktivPlanLinkCard
            aktivPlan={aktivPlan}
            linkCardTitle={linkCardTitle}
            href={getAGAktivPlanHref(narmesteLederId)}
          />
        </PlanListeDel>
      )}
      {utkast && (
        <PlanListeDel heading="Oppfølgingsplan under arbeid">
          <BodyShort size="small" textColor="subtle" className="mb-4">
            Oppfølgingsplan under arbeid slettes 4 måneder etter siste lagring.
          </BodyShort>
          <VStack gap="space-16">
            <UtkastLinkPanel
              utkast={utkast}
              linkCardTitle={linkCardTitle}
              narmesteLederId={narmesteLederId}
            />

            <SlettUtkastButtonAndModal />
          </VStack>
        </PlanListeDel>
      )}
      {harTidligerePlaner && (
        <PlanListeDel heading="Tidligere oppfølgingsplaner">
          <BodyShort size="small" textColor="subtle" className="mb-4">
            Tidligere planer er tilgjengelige i 4 måneder etter at den ansatte
            er friskmeldt.
          </BodyShort>
          <VStack gap="space-16">
            {tidligerePlaner.map((plan) => (
              <TidligerePlanLinkCard
                key={plan.id}
                tidligerePlan={plan}
                linkCardTitle={linkCardTitle}
                href={getAGTidligerePlanHref(narmesteLederId, plan.id)}
              />
            ))}
          </VStack>
        </PlanListeDel>
      )}
    </section>
  );
}
