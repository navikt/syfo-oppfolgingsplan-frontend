import { Suspense } from "react";
import AktivPlanForSM from "@/components/FerdigstiltPlanSider/AktivPlanSide/AktivPlanForSM.tsx";
import FerdigstiltPlanSkeleton from "@/components/FerdigstiltPlanSider/Shared/FerdigstiltPlanSkeleton.tsx";
import { Lumi } from "@/ui/Lumi/Lumi";
import { lumiSurveySM } from "@/ui/Lumi/lumiSurveySM";

export default async function AktivPlanPageForSM({
  params,
}: PageProps<`/sykmeldt/aktiv-plan/[planId]`>) {
  const { planId } = await params;

  return (
    <Suspense fallback={<FerdigstiltPlanSkeleton />}>
      <AktivPlanForSM planId={planId} />

      <Lumi feedbackId="Ny oppfølgingsplan - sykmeldt" survey={lumiSurveySM} />
    </Suspense>
  );
}
