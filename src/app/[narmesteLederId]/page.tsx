import { PlantIcon } from "@navikt/aksel-icons";
import { BodyLong, Heading } from "@navikt/ds-react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "@navikt/ds-react/InfoCard";
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

      <InfoCard data-color="info" className={"mb-8"}>
        <InfoCardHeader icon={<PlantIcon aria-hidden />}>
          <InfoCardTitle as="h3">Ny oppfølgingsplan!</InfoCardTitle>
        </InfoCardHeader>
        <InfoCardContent>
          Vi har laget en ny versjon av oppfølgingsplan-tjenesten. Håper du
          liker den!
        </InfoCardContent>
      </InfoCard>

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
