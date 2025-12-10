import { useActionState } from "react";
import { useParams } from "next/navigation";
import { DelPlanMedVeilederErrorType } from "@/common/types/errors";
import {
  DelMedVeilederResponse,
  delPlanMedVeilederServerAction,
} from "@/server/actions/delPlanMedVeileder";
import { FetchUpdateResultWithResponse } from "@/server/tokenXFetch/FetchResult";
import { getGeneralActionErrorMessage } from "@/utils/error-messages";

export function useDelPlanMedVeilederAction(
  initialDeltMedVeilederTidspunkt: string | null,
) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const initialState: FetchUpdateResultWithResponse<
    DelMedVeilederResponse | undefined,
    DelPlanMedVeilederErrorType
  > = {
    success: true,
    data: undefined,
  };

  const [result, delMedVeilederAction, isPendingDelMedVeileder] =
    useActionState(innerDelMedVeilederAction, initialState);

  async function innerDelMedVeilederAction(
    _previousState: FetchUpdateResultWithResponse<
      DelMedVeilederResponse | undefined,
      DelPlanMedVeilederErrorType
    >,
    { planId }: { planId: string },
  ): Promise<
    FetchUpdateResultWithResponse<
      DelMedVeilederResponse | undefined,
      DelPlanMedVeilederErrorType
    >
  > {
    return await delPlanMedVeilederServerAction(narmesteLederId, planId);
  }

  const errorDelMedVeileder = !result.success
    ? getGeneralActionErrorMessage(
        result.error,
        "Vi klarte ikke å dele planen med NAV. Vennligst prøv igjen senere.",
      )
    : null;

  const deltMedVeilederTidspunkt =
    result.success && result.data
      ? result.data.deltMedVeilederTidspunkt
      : initialDeltMedVeilederTidspunkt;

  return {
    deltMedVeilederTidspunkt,
    delMedVeilederAction,
    isPendingDelMedVeileder,
    errorDelMedVeileder,
  };
}
