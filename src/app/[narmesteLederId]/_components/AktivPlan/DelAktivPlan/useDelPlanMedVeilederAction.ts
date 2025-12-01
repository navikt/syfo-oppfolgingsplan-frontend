import { useActionState } from "react";
import { useParams } from "next/navigation";
import {
  DelPlanMedVeilederActionState,
  delPlanMedVeilederServerAction,
} from "@/server/actions/arbeidsgiver/delPlanMedVeileder";

export function useDelPlanMedVeilederAction(
  initialDeltMedVeilederTidspunkt: Date | null,
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
