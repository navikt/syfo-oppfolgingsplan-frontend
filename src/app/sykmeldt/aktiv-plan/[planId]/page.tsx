import { Suspense } from "react";
import AktivPlanForSM from "@/components/FerdigstiltPlanSider/AktivPlanSide/AktivPlanForSM.tsx";
import FerdigstiltPlanSkeleton from "@/components/FerdigstiltPlanSider/Shared/FerdigstiltPlanSkeleton.tsx";
import { Flexjar } from "@/ui/Flexjar/Flexjar.tsx";
import { flexjarSurveySM } from "@/ui/Flexjar/flexjarSurveySM.ts";

export default async function AktivPlanPageForSM({
  params,
}: PageProps<`/sykmeldt/aktiv-plan/[planId]`>) {
  const { planId } = await params;

  return (
    <Suspense fallback={<FerdigstiltPlanSkeleton />}>
      <AktivPlanForSM planId={planId} />

      <Flexjar
        feedbackId="Ny oppfølgingsplan - arbeidsgiver"
        survey={flexjarSurveySM}
      />
    </Suspense>
  );
}
