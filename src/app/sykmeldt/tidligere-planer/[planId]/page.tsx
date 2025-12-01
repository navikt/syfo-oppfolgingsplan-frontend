import { Suspense } from "react";
import FerdigstiltPlanSkeleton from "@/components/FerdigstiltPlanSider/Shared/FerdigstiltPlanSkeleton.tsx";
import TidligerePlanForSM from "@/components/FerdigstiltPlanSider/TidligerePlanSide/TidligerePlanForSM.tsx";

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
