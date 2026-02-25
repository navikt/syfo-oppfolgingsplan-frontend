import { useParams } from "next/navigation";
import { useActionState } from "react";
import {
  type DelPlanMedVeilederActionState,
  delPlanMedVeilederServerAction,
} from "@/server/actions/delPlanMedVeileder";

export function useDelPlanMedVeilederAction(
  initialDeltMedVeilederTidspunkt: string | null,
) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialDelPlanMedVeilederActionState: DelPlanMedVeilederActionState = {
    deltMedVeilederTidspunkt: initialDeltMedVeilederTidspunkt,
    errorDelMedVeileder: null,
  };

  const [
    { deltMedVeilederTidspunkt, errorDelMedVeileder },
    delMedVeilederAction,
    isPendingDelMedVeileder,
  ] = useActionState(
    innerDelMedVeilederAction,
    initialDelPlanMedVeilederActionState,
  );

  function innerDelMedVeilederAction(
    _previousState: DelPlanMedVeilederActionState,
    { planId }: { planId: string },
  ): Promise<DelPlanMedVeilederActionState> {
    return delPlanMedVeilederServerAction(narmesteLederId, planId);
  }

  return {
    deltMedVeilederTidspunkt,
    delMedVeilederAction,
    isPendingDelMedVeileder,
    errorDelMedVeileder,
  };
}
