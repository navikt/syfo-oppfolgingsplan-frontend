"use server";

import { redirect } from "next/navigation";
import { logger } from "@navikt/next-logger";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { FerdigstiltPlanResponse } from "@/schema/ferdigstiltPlanResponseSchemas";
import { getflatValuesObjectFromFormSnapshot } from "@/utils/FormSnapshot/getflatValuesObjectFromFormSnapshot";
import { convertPlanContentToCurrentSchema } from "@/utils/convertPlanContentToCurrentSchema";
import { fetchAktivPlanForAG } from "../fetchData/arbeidsgiver/fetchAktivPlan";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import {
  FetchResultError,
  FetchUpdateResult,
} from "../tokenXFetch/FetchResult";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";
import { lagreUtkastServerAction } from "./lagreUtkast";
import { isNonEmptyString } from "./serverActionsInputValidation";

export async function overskrivUtkastMedInnholdFraAktivPlanServerAction(
  _previousState: FetchUpdateResult,
  narmesteLederId: string,
): Promise<FetchUpdateResult> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return redirect(getAGOpprettNyPlanHref(narmesteLederId));
  }

  // Input validation
  const isNarmesteLederIdValid = isNonEmptyString(narmesteLederId);
  if (!isNarmesteLederIdValid) {
    logger.error(
      `overskrivUtkastMedPlanInnholdServerAction invalid narmesteLederId: ${narmesteLederId}`,
    );

    return {
      success: false,
      error: {
        type: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR,
      },
    };
  }

  // Fetch aktiv plan
  let aktivPlanResponse: FerdigstiltPlanResponse;
  try {
    aktivPlanResponse = await fetchAktivPlanForAG(narmesteLederId);
  } catch (err) {
    return {
      success: false,
      error: err as FetchResultError,
    };
  }

  // Convert aktivPlan formSnapshot to content that can be saved as utkast.
  const aktivPlanFormSnapshot = aktivPlanResponse.oppfolgingsplan.content;

  const planContent = getflatValuesObjectFromFormSnapshot(
    aktivPlanFormSnapshot,
  );
  const convertedPlanContent = convertPlanContentToCurrentSchema(planContent);

  // Save utkast
  const lagreUtkastResult = await lagreUtkastServerAction(
    narmesteLederId,
    convertedPlanContent,
  );

  if (!lagreUtkastResult.success) {
    return {
      success: false,
      error: lagreUtkastResult.error,
    };
  } else {
    // Redirect to ny plan page on success
    return redirect(getAGOpprettNyPlanHref(narmesteLederId));
  }
}
