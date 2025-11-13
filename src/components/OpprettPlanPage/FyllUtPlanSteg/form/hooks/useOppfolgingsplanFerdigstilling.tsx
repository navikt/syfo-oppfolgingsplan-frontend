import { startTransition, useActionState } from "react";
import { useParams } from "next/navigation";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import {
  FerdistillPlanActionState,
  ferdigstillPlanServerAction,
} from "@/server/actions/ferdigstillPlan";

export default function useOppfolgingsplanFerdigstilling() {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialFerdigstillState = { error: null };

  const [{ error }, ferdigstillPlanDispatchAction, isPendingFerdigstillPlan] =
    useActionState(ferdigstillPlanAction, initialFerdigstillState);

  async function ferdigstillPlanAction(
    previousReturnedValue: FerdistillPlanActionState,
    values: OppfolgingsplanForm
  ) {
    return await ferdigstillPlanServerAction(values, narmesteLederId);
  }

  function startFerdigstillPlan(values: OppfolgingsplanForm) {
    startTransition(() => {
      ferdigstillPlanDispatchAction(values);
    });
  }

  return {
    error,
    startFerdigstillPlan,
    isPendingFerdigstillPlan,
  };
}
