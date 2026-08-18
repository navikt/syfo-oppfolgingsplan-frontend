import { AnsattIkkeSykmeldtAlert } from "@/components/OversiktSide/AnsattIkkeSykmeldtAlert.tsx";
import OversiktSideInformasjon, {
  TiltaksgruppeInformasjon,
} from "@/components/OversiktSide/InformasjonSection/OversiktSideInformasjon";
import OversiktSideIntroduksjon from "@/components/OversiktSide/InformasjonSection/OversiktSideIntroduksjon";
import NyPlanButtonHvisTomListe from "@/components/OversiktSide/PlanListe/NyPlanButtonHvisTomListe";
import PlanListeForArbeidsgiver from "@/components/OversiktSide/PlanListe/PlanListeForArbeidsgiver";
import { erNarmesteLederINavTiltaksgruppe } from "@/server/fetchData/arbeidsgiver/erNarmesteLederINavTiltaksgruppe";

/**
 * Alt innholdet på oversiktssiden som avhenger av tiltaksgruppe-flagget.
 * Rendres bak Suspense slik at siden kan streame skjelettet med en gang,
 * uten å vente på oversikts- og Flaggskipet-kallene.
 */
export default async function OversiktInnholdForArbeidsgiver({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  const erITiltaksgruppe =
    await erNarmesteLederINavTiltaksgruppe(narmesteLederId);

  return (
    <>
      <OversiktSideIntroduksjon erITiltaksgruppe={erITiltaksgruppe} />

      {erITiltaksgruppe && <TiltaksgruppeInformasjon />}

      <AnsattIkkeSykmeldtAlert narmesteLederId={narmesteLederId} />
      <NyPlanButtonHvisTomListe
        narmesteLederId={narmesteLederId}
        erITiltaksgruppe={erITiltaksgruppe}
      />
      <PlanListeForArbeidsgiver narmesteLederId={narmesteLederId} />

      {!erITiltaksgruppe && <OversiktSideInformasjon />}
    </>
  );
}
