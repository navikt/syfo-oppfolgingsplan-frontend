import { Suspense } from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import PlanListeSkeleton from "@/common/components/Skeletons/PlanListeSkeleton";
import TextContentBox from "@/common/components/layout/TextContentBox";
import PlanListeForSykmeldt from "./_components/Oversikt/PlanListeForSykmeldt";

export default async function OversiktPageForSM() {
  return (
    <>
      <Heading level="2" size="xlarge" spacing>
        Oppfølgingsplaner
      </Heading>

      <TextContentBox>
        <BodyLong size="large" spacing>
          Oppfølgingsplanen skal gjøre det lettere for deg å bli i jobben.
          Hensikten er å finne ut hvilke oppgaver du kan gjøre hvis lederen din
          legger til rette for det. Arbeidsgiver har plikt til å lage en plan
          sammen med deg innen du har vært sykmeldt i fire uker. Dere kan endre
          den når som helst etter hvert som dere ser hvordan det går.
        </BodyLong>
      </TextContentBox>

      <Suspense fallback={<PlanListeSkeleton />}>
        <PlanListeForSykmeldt />
      </Suspense>
    </>
  );
}
