import { Suspense } from "react";
import { getAGOversiktHref } from "@/common/route-hrefs";
import TidligerePlanForAG from "@/components/FerdigstiltPlanSider/TidligerePlanSide/TidligerePlanForAG";
import { BigLoadingSpinner } from "@/ui/BigLoadingSpinner.tsx";
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

      <Suspense fallback={<BigLoadingSpinner />}>
        <TidligerePlanForAG narmesteLederId={narmesteLederId} planId={planId} />
      </Suspense>
    </>
  );
}
