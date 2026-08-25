import { Heading } from "@navikt/ds-react";
import { Suspense } from "react";
import PlanListeForSykmeldt from "@/components/OversiktSide/PlanListe/PlanListeForSykmeldt.tsx";
import PlanListeSkeleton from "@/components/OversiktSide/PlanListe/PlanListeSkeleton.tsx";

export default async function OversiktPageForSM(_: PageProps<"/sykmeldt">) {
  return (
    <>
      <Heading level="2" size="xlarge" spacing>
        Oppfølgingsplaner
      </Heading>

      <Suspense fallback={<PlanListeSkeleton />}>
        <PlanListeForSykmeldt />
      </Suspense>
    </>
  );
}
