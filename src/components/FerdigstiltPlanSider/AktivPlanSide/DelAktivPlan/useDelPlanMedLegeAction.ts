import { useActionState } from "react";
import { useParams } from "next/navigation";
import { DelPlanMedLegeErrorType } from "@/common/types/errors";
import {
  DelMedLegeResponse,
  delPlanMedLegeServerAction,
} from "@/server/actions/delPlanMedLege";
import { FetchUpdateResultWithResponse } from "@/server/tokenXFetch/FetchResult";
import { getDelPlanMedLegeErrorMessage } from "@/utils/error-messages";

export function useDelPlanMedLegeAction(
  initialDeltMedLegeTidspunkt: Date | null,
) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialState: FetchUpdateResultWithResponse<
    DelMedLegeResponse | undefined,
    DelPlanMedLegeErrorType
  > = {
    success: true,
    data: undefined,
  };

  const [result, delMedLegeAction, isPendingDelMedLege] = useActionState(
    innerDelMedLegeAction,
    initialState,
  );

  async function innerDelMedLegeAction(
    _previousState: FetchUpdateResultWithResponse<
      DelMedLegeResponse | undefined,
      DelPlanMedLegeErrorType
    >,
    { planId }: { planId: string },
  ): Promise<
    FetchUpdateResultWithResponse<
      DelMedLegeResponse | undefined,
      DelPlanMedLegeErrorType
    >
  > {
    return await delPlanMedLegeServerAction(narmesteLederId, planId);
  }

  const errorDelMedLege = !result.success
    ? getDelPlanMedLegeErrorMessage(result.error)
    : null;

  const deltMedLegeTidspunkt =
    result.success && result.data
      ? new Date(result.data.deltMedLegeTidspunkt)
      : initialDeltMedLegeTidspunkt;

  return {
    deltMedLegeTidspunkt,
    delMedLegeAction,
    isPendingDelMedLege,
    errorDelMedLege,
  };
}
