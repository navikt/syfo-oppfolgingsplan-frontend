import {
  OppfolgingsplanDataForOversikt,
  UtkastDataForOversikt,
} from "@/schema/oppfolgingsplanOversiktSchema";
import { Heading, VStack } from "@navikt/ds-react";
import PlanLinkPanel from "./PlanLinkPanel/PlanLinkPanel";
import AktivPlanLinkPanel from "./AktivPlanLinkPanel";
import UtkastLinkPanel from "./UtkastLinkPanel";
import SlettUtkastKnapp from "./UtkastLinkPanelOgSlettKnapp";

interface Props {
  aktivPlan: OppfolgingsplanDataForOversikt | null;
  utkast: UtkastDataForOversikt | null;
  tidligerePlaner: OppfolgingsplanDataForOversikt[];
}

export default function PlanListe({
  aktivPlan,
  utkast,
  tidligerePlaner,
}: Props) {
  return (
    <section className="mb-12">
      {aktivPlan && (
        <VStack className="mb-8">
          <Heading level="3" size="medium" spacing>
            Aktiv oppfølgingsplan
          </Heading>

          <AktivPlanLinkPanel aktivPlan={aktivPlan} />
        </VStack>
      )}

      {utkast && (
        <VStack gap="4" className="mb-8">
          <Heading level="3" size="medium" spacing>
            Oppfølgingsplan under arbeid
          </Heading>

          <UtkastLinkPanel utkast={utkast} />

          <SlettUtkastKnapp />
        </VStack>
      )}

      {tidligerePlaner && (
        <VStack className="mb-8">
          <Heading level="3" size="medium" spacing>
            Tidligere oppfølgingsplaner
          </Heading>

          <VStack gap="4">
            {tidligerePlaner.map((plan) => (
              <PlanLinkPanel
                key={plan.uuid}
                className="bg-ax-bg-neutral-soft"
                href={`$TODO/${plan.uuid}`}
                arbeidsplassNavn="TODO"
                opprettetDato={new Date(plan.createdAt)}
                evalueringsDato={new Date(plan.evalueringsdato)}
                isDeltMedLege={plan.deltMedLegeTidspunkt !== null}
                isDeltMedNav={plan.deltMedVeilederTidspunkt !== null}
                isForPreviousPlan
              />
            ))}
          </VStack>
        </VStack>
      )}
    </section>
  );
}
