import { Suspense } from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import PlanListeForSykmeldt from "@/components/OversiktSide/PlanListe/PlanListeForSykmeldt.tsx";
import PlanListeSkeleton from "@/components/OversiktSide/PlanListe/PlanListeSkeleton.tsx";
import TextContentBox from "@/components/layout/TextContentBox.tsx";

export default async function OversiktPageForSM() {
  return (
    <>
      <Heading level="2" size="xlarge" spacing>
        Oppfølgingsplaner
      </Heading>

      <TextContentBox>
        <BodyLong size="large" className="mb-4">
          På denne siden finner du oppfølgingsplanene lederen din lager i dialog
          med deg. Lederen din er lovpålagt å lage oppfølgingsplanen, og dele
          den med fastlegen din innen fire ukers sykefravær.
        </BodyLong>
        <BodyLong size="large" spacing>
          Du har ansvar for å bidra med innhold til planen. Oppfølgingsplanen
          skal hjelpe deg tilbake i jobb på en trygg og tilpasset måte. For at
          planen skal bli best mulig tilpasset deg og din arbeidssituasjon, er
          det viktig at du snakker med lederen din om hva du trenger.
        </BodyLong>
      </TextContentBox>

      <Suspense fallback={<PlanListeSkeleton />}>
        <PlanListeForSykmeldt />
      </Suspense>
    </>
  );
}
