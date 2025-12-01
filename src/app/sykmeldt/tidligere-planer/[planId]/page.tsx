import { Suspense } from "react";
import FerdigstiltPlanSkeleton from "@/common/components/Skeletons/FerdigstiltPlanSkeleton";
import TidligerePlanForSM from "../../_components/TidligerePlan/TidligerePlanForSM";

export default async function TidligerePlanPageForSM({
  params,
}: PageProps<`/sykmeldt/tidligere-planer/[planId]`>) {
  const { planId } = await params;

  return (
    <Suspense fallback={<FerdigstiltPlanSkeleton />}>
      <TidligerePlanForSM planId={planId} />
    </Suspense>
  );
}
