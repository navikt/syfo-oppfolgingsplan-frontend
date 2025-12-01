import { Suspense } from "react";
import Breadcrumbs from "@/common/components/Breadcrumbs";
import FerdigstiltPlanSkeleton from "@/common/components/Skeletons/FerdigstiltPlanSkeleton";
import { getAGOversiktHref } from "@/common/route-hrefs";
import TidligerePlanForAG from "../../_components/TidligerePlan/TidligerePlanForAG";

export default async function TidligerePlanPageForAG({
  params,
}: PageProps<`/[narmesteLederId]/tidligere-planer/[planId]`>) {
  const { narmesteLederId, planId } = await params;

  return (
    <>
      <Breadcrumbs
        firstCrumbOppfolgingsplanerHref={getAGOversiktHref(narmesteLederId)}
        secondCrumbText="Tidligere plan"
      />

      <Suspense fallback={<FerdigstiltPlanSkeleton />}>
        <TidligerePlanForAG narmesteLederId={narmesteLederId} planId={planId} />
      </Suspense>
    </>
  );
}
