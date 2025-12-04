import { Suspense } from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import OversiktSideInformasjon from "@/components/OversiktSide/InformasjonSection/OversiktSideInformasjon";
import NyPlanButtonHvisTomListe from "@/components/OversiktSide/PlanListe/NyPlanButtonHvisTomListe";
import PlanListeForArbeidsgiver from "@/components/OversiktSide/PlanListe/PlanListeForArbeidsgiver";
import TextContentBox from "@/components/layout/TextContentBox";
import { BigLoadingSpinner } from "@/ui/BigLoadingSpinner.tsx";

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

      <Suspense fallback={<BigLoadingSpinner />}>
        <NyPlanButtonHvisTomListe narmesteLederId={narmesteLederId} />
        <PlanListeForArbeidsgiver narmesteLederId={narmesteLederId} />
      </Suspense>

      <OversiktSideInformasjon />
    </>
  );
}
