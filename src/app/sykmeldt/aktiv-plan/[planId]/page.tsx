import { Suspense } from "react";
import AktivPlanForSM from "@/components/FerdigstiltPlanSider/AktivPlanSide/AktivPlanForSM.tsx";
import FerdigstiltPlanSkeleton from "@/components/FerdigstiltPlanSider/Shared/FerdigstiltPlanSkeleton.tsx";

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
