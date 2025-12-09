import { useActionState } from "react";
import { useParams } from "next/navigation";
import {
  DelPlanMedLegeActionState,
  delPlanMedLegeServerAction,
} from "@/server/actions/delPlanMedLege";

export function useDelPlanMedLegeAction(
  initialDeltMedLegeTidspunkt: string | null,
) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialDelPlanMedLegeActionState: DelPlanMedLegeActionState = {
    deltMedLegeTidspunkt: initialDeltMedLegeTidspunkt,
    errorDelMedLege: null,
  };

  const [
    { deltMedLegeTidspunkt, errorDelMedLege },
    delMedLegeAction,
    isPendingDelMedLege,
  ] = useActionState(innerDelMedLegeAction, initialDelPlanMedLegeActionState);

  function innerDelMedLegeAction(
    _previousState: DelPlanMedLegeActionState,
    { planId }: { planId: string },
  ): Promise<DelPlanMedLegeActionState> {
    return delPlanMedLegeServerAction(narmesteLederId, planId);
  }

  return {
    deltMedLegeTidspunkt,
    delMedLegeAction,
    isPendingDelMedLege,
    errorDelMedLege,
  };
}
