import { Suspense } from "react";
import {
  NYLIG_OPPRETTET_SEARCH_PARAM,
  getAGOversiktHref,
} from "@/common/route-hrefs";
import AktivPlanForAG from "@/components/FerdigstiltPlanSider/AktivPlanSide/AktivPlanForAG";
import FerdigstiltPlanSkeleton from "@/components/FerdigstiltPlanSider/Shared/FerdigstiltPlanSkeleton";
import Breadcrumbs from "@/ui/Breadcrumbs";
import { Flexjar } from "@/ui/Flexjar/Flexjar.tsx";
import { flexjarSurveyAG } from "@/ui/Flexjar/flexjarSurveyAG.ts";

export default async function AktivPlanPageForAG({
  params,
  searchParams,
}: PageProps<"/[narmesteLederId]/aktiv-plan">) {
  const { narmesteLederId } = await params;
  const { [NYLIG_OPPRETTET_SEARCH_PARAM]: nyligOpprettetParam } =
    await searchParams;

  return (
    <>
      <Breadcrumbs
        firstCrumbOppfolgingsplanerHref={getAGOversiktHref(narmesteLederId)}
        secondCrumbText="Aktiv plan"
      />

      <Suspense fallback={<FerdigstiltPlanSkeleton />}>
        <AktivPlanForAG
          narmesteLederId={narmesteLederId}
          nyligOpprettet={nyligOpprettetParam === "true"}
        />

        <Flexjar
          feedbackId="Ny oppfølgingsplan - arbeidsgiver"
          survey={flexjarSurveyAG}
        />
      </Suspense>
    </>
  );
}
