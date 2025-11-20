import { VStack } from "@navikt/ds-react";
import {
  getAGAktivPlanHref,
  getAGTidligerePlanHref,
} from "@/common/route-hrefs";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversiktForAG";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import UtkastLinkPanel from "./PlanLinkCard/UtkastLinkCard";
import PlanListeDel from "./PlanListeDel";
import { SlettUtkastButtonAndModal } from "./SlettUtkast/SlettUtkastButtonAndModal";

interface Props {
  narmesteLederId: string;
}

export default async function PlanListeForArbeidsgiver({
  narmesteLederId,
}: Props) {
  const {
    oversikt: { aktivPlan, tidligerePlaner, utkast },
  } = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  const harTidligerePlaner = tidligerePlaner.length > 0;

  // TODO: Hent fra backend
  const arbeidsstedNavn = "Arbeidssted AS";

  return (
    <section className="mb-12">
      {aktivPlan && (
        <PlanListeDel heading="Aktiv plan">
          <AktivPlanLinkCard
            aktivPlan={aktivPlan}
            arbeidsstedNavn={arbeidsstedNavn}
            href={getAGAktivPlanHref(narmesteLederId)}
          />
        </PlanListeDel>
      )}

      {utkast && (
        <PlanListeDel heading="Utkast til plan">
          <VStack gap="4">
            <UtkastLinkPanel
              utkast={utkast}
              arbeidsstedNavn={arbeidsstedNavn}
              narmesteLederId={narmesteLederId}
            />

            <SlettUtkastButtonAndModal />
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
                arbeidsstedNavn={arbeidsstedNavn}
                href={getAGTidligerePlanHref(narmesteLederId, plan.id)}
              />
            ))}
          </VStack>
        </PlanListeDel>
      )}
    </section>
  );
}
