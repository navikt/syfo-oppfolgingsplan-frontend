import { Suspense } from "react";
import FerdigstiltPlanSkeleton from "@/common/components/Skeletons/FerdigstiltPlanSkeleton";
import AktivPlanForSM from "../../_components/AktivPlan/AktivPlanForSM";

export default async function AktivPlanPageForSM({
  params,
}: PageProps<`/sykmeldt/aktiv-plan/[planId]`>) {
  const { planId } = await params;

  return (
    <Suspense fallback={<FerdigstiltPlanSkeleton />}>
      <AktivPlanForSM planId={planId} />
    </Suspense>
  );
}
