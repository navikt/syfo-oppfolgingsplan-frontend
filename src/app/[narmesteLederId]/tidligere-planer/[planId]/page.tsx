import { Suspense } from "react";
import { getAGOversiktHref } from "@/common/route-hrefs";
import FerdigstiltPlanSkeleton from "@/components/FerdigstiltPlanSider/Shared/FerdigstiltPlanSkeleton";
import TidligerePlanForAG from "@/components/FerdigstiltPlanSider/TidligerePlanSide/TidligerePlanForAG";
import Breadcrumbs from "@/ui/Breadcrumbs";

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
