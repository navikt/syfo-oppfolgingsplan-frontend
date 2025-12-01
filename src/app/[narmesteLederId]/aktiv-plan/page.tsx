import { Suspense } from "react";
import Breadcrumbs from "@/common/components/Breadcrumbs";
import FerdigstiltPlanSkeleton from "@/common/components/Skeletons/FerdigstiltPlanSkeleton";
import {
  NYLIG_OPPRETTET_SEARCH_PARAM,
  getAGOversiktHref,
} from "@/common/route-hrefs";
import AktivPlanForAG from "../_components/AktivPlan/AktivPlanForAG";

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
      </Suspense>
    </>
  );
}
