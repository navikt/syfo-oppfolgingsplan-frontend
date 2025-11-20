import { startTransition, useActionState } from "react";
import { useParams } from "next/navigation";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import {
  FerdistillPlanActionState,
  ferdigstillPlanServerAction,
} from "@/server/actions/ferdigstillPlan";

export default function useFerdigstillOppfolgingsplanAction() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialFerdigstillState = { error: null };

  const [{ error }, ferdigstillPlanAction, isPendingFerdigstillPlan] =
    useActionState(innerFerdigstillPlanAction, initialFerdigstillState);

  function innerFerdigstillPlanAction(
    _previousState: FerdistillPlanActionState,
    values: OppfolgingsplanForm,
  ): Promise<FerdistillPlanActionState> {
    return ferdigstillPlanServerAction(values, narmesteLederId);
  }

  function startFerdigstillPlanAction(values: OppfolgingsplanForm) {
    startTransition(() => {
      ferdigstillPlanAction(values);
    });
  }

  return {
    startFerdigstillPlanAction,
    isPendingFerdigstillPlan,
    error,
  };
}
