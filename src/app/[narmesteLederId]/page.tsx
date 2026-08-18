import { Heading } from "@navikt/ds-react";
import { Suspense } from "react";
import OversiktInnholdForArbeidsgiver from "@/components/OversiktSide/OversiktInnholdForArbeidsgiver";
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

      <Suspense fallback={<PlanListeSkeleton />}>
        <OversiktInnholdForArbeidsgiver narmesteLederId={narmesteLederId} />
      </Suspense>
    </>
  );
}
