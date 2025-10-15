import { Heading, VStack } from "@navikt/ds-react";
import {
  OppfolgingsplanMetadata,
  UtkastMetadata,
} from "@/schema/oppfolgingsplanerOversiktSchemas";
import { getAGOppfolgingplanHref } from "@/constants/route-hrefs";
import AktivPlanLinkCard from "./PlanLinkCard/AktivPlanLinkCard";
import UtkastLinkPanel from "./PlanLinkCard/UtkastLinkCard";
import SlettUtkastKnapp from "./SlettUtkastKnapp";
import TidligerePlanLinkCard from "./PlanLinkCard/TidligerePlanLinkCard";

interface Props {
  narmesteLederId: string;
  aktivPlan: OppfolgingsplanMetadata | null;
  utkast: UtkastMetadata | null;
  tidligerePlaner: OppfolgingsplanMetadata[];
  arbeidsstedNavn: string;
}

export default function PlanListeForArbeidsgiver({
  narmesteLederId,
  aktivPlan,
  utkast,
  tidligerePlaner,
  arbeidsstedNavn,
}: Props) {
  return (
    <section className="mb-12">
      {aktivPlan && (
        <VStack className="mb-8">
          <Heading level="3" size="medium" spacing>
            Aktiv plan
          </Heading>

          <AktivPlanLinkCard
            aktivPlan={aktivPlan}
            arbeidsstedNavn={arbeidsstedNavn}
            href={getAGOppfolgingplanHref(narmesteLederId, aktivPlan.uuid)}
          />
        </VStack>
      )}

      {utkast && (
        <VStack className="mb-8">
          <Heading level="3" size="medium" spacing>
            Utkast til plan
          </Heading>

          <VStack gap="4">
            <UtkastLinkPanel
              utkast={utkast}
              arbeidsstedNavn={arbeidsstedNavn}
              narmesteLederId={narmesteLederId}
            />
            <SlettUtkastKnapp />
          </VStack>
        </VStack>
      )}

      {tidligerePlaner.length > 0 && (
        <VStack className="mb-8">
          <Heading level="3" size="medium" spacing>
            Tidligere planer
          </Heading>

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
        </VStack>
      )}
    </section>
  );
}
