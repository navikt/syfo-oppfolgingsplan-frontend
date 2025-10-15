import { Suspense } from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import TextContentBox from "../../components/layout/TextContentBox";
import HelpSection from "../../components/PlanOversikt/HelpSection/HelpSection";
import LagPlanKnappOgPlanListe from "./components/LagPlanKnappOgPlanListe";
import PlanListeSkeleton from "./components/PlanListeSkeleton";

export default async function NarmesteLederOversiktPage({
  params,
}: {
  params: Promise<{ narmesteLederId: string }>;
}) {
  const { narmesteLederId } = await params;

  return (
    <main>
      <Heading level="2" size="xlarge" spacing>
        Oppfølgingsplaner
      </Heading>

      <TextContentBox>
        <BodyLong size="large" spacing>
          Oppfølgingsplanen er et verktøy som brukes i sykefraværsoppfølgingen.
          Du og den sykmeldte ansatte skal samarbeide om å finne løsninger slik
          at den ansatte kan komme tilbake i arbeid.
        </BodyLong>
      </TextContentBox>

      <Suspense fallback={<PlanListeSkeleton />}>
        <LagPlanKnappOgPlanListe narmesteLederId={narmesteLederId} />
      </Suspense>

      <Heading level="3" size="medium" className="mb-8">
        Hjelp til å lage og bruke oppfølgingsplaner
      </Heading>

      <HelpSection />
    </main>
  );
}
