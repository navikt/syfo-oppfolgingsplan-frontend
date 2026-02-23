import { useParams } from "next/navigation";
import { startTransition, useActionState } from "react";
import type z from "zod";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import type { ferdigstillPlanActionPayloadSchema } from "@/server/actions/serverActionsInputValidation";
import type { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";

export type FerdigstillPlanActionPayload = z.infer<
  typeof ferdigstillPlanActionPayloadSchema
>;

export default function useFerdigstillOppfolgingsplanAction() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialFerdigstillState = { error: null };

  const [{ error }, ferdigstillPlanAction, isPendingFerdigstillPlan] =
    useActionState(innerFerdigstillPlanAction, initialFerdigstillState);

  function innerFerdigstillPlanAction(
    _previousState: FetchUpdateResult,
    payload: FerdigstillPlanActionPayload,
  ): Promise<FetchUpdateResult> {
    return ferdigstillPlanServerAction(narmesteLederId, payload);
  }

  function startFerdigstillPlanAction(payload: FerdigstillPlanActionPayload) {
    startTransition(() => {
      ferdigstillPlanAction(payload);
    });
  }

  return {
    startFerdigstillPlanAction,
    isPendingFerdigstillPlan,
    error,
  };
}
