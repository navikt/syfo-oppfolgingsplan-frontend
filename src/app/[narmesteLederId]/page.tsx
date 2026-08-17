import { Heading } from "@navikt/ds-react";
import { Suspense } from "react";
import { AnsattIkkeSykmeldtAlert } from "@/components/OversiktSide/AnsattIkkeSykmeldtAlert.tsx";
import OversiktSideInformasjon from "@/components/OversiktSide/InformasjonSection/OversiktSideInformasjon";
import OversiktSideIntroduksjon from "@/components/OversiktSide/InformasjonSection/OversiktSideIntroduksjon";
import NyPlanButtonHvisTomListe from "@/components/OversiktSide/PlanListe/NyPlanButtonHvisTomListe";
import PlanListeForArbeidsgiver from "@/components/OversiktSide/PlanListe/PlanListeForArbeidsgiver";
import PlanListeSkeleton from "@/components/OversiktSide/PlanListe/PlanListeSkeleton";
import { erNarmesteLederINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erNarmesteLederINavTiltaksgruppe";

export default async function OversiktPageForAG({
  params,
}: PageProps<"/[narmesteLederId]">) {
  const { narmesteLederId } = await params;
  const erITiltaksgruppe =
    await erNarmesteLederINavTiltaksgruppe(narmesteLederId);

  return (
    <>
      <Heading level="2" size="xlarge" spacing>
        Oppfølgingsplaner
      </Heading>

      <OversiktSideIntroduksjon erITiltaksgruppe={erITiltaksgruppe} />

      {erITiltaksgruppe && <OversiktSideInformasjon erITiltaksgruppe={true} />}

      <Suspense fallback={<PlanListeSkeleton />}>
        <AnsattIkkeSykmeldtAlert narmesteLederId={narmesteLederId} />
        <NyPlanButtonHvisTomListe
          narmesteLederId={narmesteLederId}
          erITiltaksgruppe={erITiltaksgruppe}
        />
        <PlanListeForArbeidsgiver narmesteLederId={narmesteLederId} />
      </Suspense>

      {!erITiltaksgruppe && <OversiktSideInformasjon />}
    </>
  );
}
