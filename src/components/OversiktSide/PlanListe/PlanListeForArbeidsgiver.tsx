import { VStack } from "@navikt/ds-react";
import { getAGOppfolgingplanHref } from "@/constants/route-hrefs";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversiktForAG";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";
import UtkastLinkPanel from "./PlanLinkCard/UtkastLinkCard";
import PlanListeDel from "./PlanListeDel";
import SlettUtkastButton from "./SlettUtkastButton";

interface Props {
  narmesteLederId: string;
}

export default async function PlanListeForArbeidsgiver({
  narmesteLederId,
}: Props) {
  const {
    oppfolgingsplan: aktivPlan,
    previousOppfolgingsplaner: tidligerePlaner,
    utkast,
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
            href={getAGOppfolgingplanHref(narmesteLederId, aktivPlan.uuid)}
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

            <SlettUtkastButton />
          </VStack>
        </PlanListeDel>
      )}

      {harTidligerePlaner && (
        <PlanListeDel heading="Tidligere planer">
          <VStack gap="4">
            {tidligerePlaner.map((plan) => (
              <TidligerePlanLinkCard
                key={plan.uuid}
                tidligerePlan={plan}
                arbeidsstedNavn={arbeidsstedNavn}
                href={getAGOppfolgingplanHref(narmesteLederId, plan.uuid)}
              />
            ))}
          </VStack>
        </PlanListeDel>
      )}
    </section>
  );
}
