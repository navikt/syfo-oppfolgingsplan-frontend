import { Suspense } from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import PlanListeSkeleton from "@/common/components/Skeletons/PlanListeSkeleton";
import TextContentBox from "@/common/components/layout/TextContentBox";
import OversiktSideInformasjon from "./_components/Oversikt/InformasjonSection/OversiktSideInformasjon";
import NyPlanButtonHvisTomListe from "./_components/Oversikt/NyPlanButtonHvisTomListe";
import PlanListeForArbeidsgiver from "./_components/Oversikt/PlanListeForArbeidsgiver";

export default async function OversiktPageForAG({
  params,
}: PageProps<"/[narmesteLederId]">) {
  const { narmesteLederId } = await params;

  return (
    <>
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
        <NyPlanButtonHvisTomListe narmesteLederId={narmesteLederId} />
        <PlanListeForArbeidsgiver narmesteLederId={narmesteLederId} />
      </Suspense>

      <OversiktSideInformasjon />
    </>
  );
}
