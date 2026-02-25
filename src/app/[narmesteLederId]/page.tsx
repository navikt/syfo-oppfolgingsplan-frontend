import { BodyLong, Heading } from "@navikt/ds-react";
import { Suspense } from "react";
import TextContentBox from "@/components/layout/TextContentBox";
import { AnsattIkkeSykmeldtAlert } from "@/components/OversiktSide/AnsattIkkeSykmeldtAlert.tsx";
import OversiktSideInformasjon from "@/components/OversiktSide/InformasjonSection/OversiktSideInformasjon";
import { LenkeTilGamlePlanenAG } from "@/components/OversiktSide/LenkeTilGamlePlanenAG";
import NyPlanButtonHvisTomListe from "@/components/OversiktSide/PlanListe/NyPlanButtonHvisTomListe";
import PlanListeForArbeidsgiver from "@/components/OversiktSide/PlanListe/PlanListeForArbeidsgiver";
import PlanListeSkeleton from "@/components/OversiktSide/PlanListe/PlanListeSkeleton";

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
        <AnsattIkkeSykmeldtAlert narmesteLederId={narmesteLederId} />
        <NyPlanButtonHvisTomListe narmesteLederId={narmesteLederId} />
        <PlanListeForArbeidsgiver narmesteLederId={narmesteLederId} />
      </Suspense>

      <OversiktSideInformasjon />

      <LenkeTilGamlePlanenAG narmesteLederId={narmesteLederId} />
    </>
  );
}
