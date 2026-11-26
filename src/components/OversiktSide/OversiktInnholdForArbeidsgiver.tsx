import { AnsattIkkeSykmeldtAlert } from "@/components/OversiktSide/AnsattIkkeSykmeldtAlert.tsx";
import OversiktSideInformasjon from "@/components/OversiktSide/InformasjonSection/OversiktSideInformasjon";
import OversiktSideIntroduksjon from "@/components/OversiktSide/InformasjonSection/OversiktSideIntroduksjon";
import NyPlanButtonHvisTomListe from "@/components/OversiktSide/PlanListe/NyPlanButtonHvisTomListe";
import PlanListeForArbeidsgiver from "@/components/OversiktSide/PlanListe/PlanListeForArbeidsgiver";

/**
 * Innholdet på oversiktssiden som avhenger av oversiktsdata.
 * Rendres bak Suspense slik at siden kan streame skjelettet med en gang.
 */
export default function OversiktInnholdForArbeidsgiver({
  narmesteLederId,
}: {
  narmesteLederId: string;
}) {
  return (
    <>
      <OversiktSideIntroduksjon />

      <OversiktSideInformasjon />

      <AnsattIkkeSykmeldtAlert narmesteLederId={narmesteLederId} />
      <NyPlanButtonHvisTomListe narmesteLederId={narmesteLederId} />
      <PlanListeForArbeidsgiver narmesteLederId={narmesteLederId} />
    </>
  );
}
