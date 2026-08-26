import { Heading } from "@navikt/ds-react";
import { Suspense } from "react";
import PlanListeSkeleton from "@/components/OversiktSide/PlanListe/PlanListeSkeleton.tsx";
import OversiktInnholdForSykmeldt from "@/components/OversiktSide/Sykmeldt/OversiktInnholdForSykmeldt";

export default async function OversiktPageForSM(_: PageProps<"/sykmeldt">) {
  return (
    <>
      <Heading level="2" size="xlarge" spacing>
        Oppfølgingsplaner
      </Heading>

      <Suspense fallback={<PlanListeSkeleton />}>
        <OversiktInnholdForSykmeldt />
      </Suspense>
    </>
  );
}
