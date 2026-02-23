"use server";

import { logger } from "@navikt/next-logger";
import { redirect } from "next/navigation";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import type { FerdigstiltPlanResponse } from "@/schema/ferdigstiltPlanResponseSchemas";
import { convertPlanContentToCurrentSchema } from "@/utils/convertPlanContentToCurrentSchema";
import { extractValuesFromFormSnapshot } from "@/utils/FormSnapshot/extractValuesFromFormSnapshot";
import { fetchAktivPlanForAG } from "../fetchData/arbeidsgiver/fetchAktivPlan";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import type {
  FetchResultError,
  FetchUpdateResult,
} from "../tokenXFetch/FetchResult";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";
import { lagreUtkastServerAction } from "./lagreUtkast";
import { isNonEmptyString } from "./serverActionsInputValidation";

/**
 * Henter innhold fra aktiv plan, konverterer det til nåværende utkast-format,
 * lagrer det som utkast (overskriver eventuelt eksisterende utkast), og
 * redirecter til "ny plan"-side.
 */
export async function upsertUtkastWithAktivPlanServerAction(
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
      error: err as FetchResultError,
    };
  }

  // Convert aktivPlan formSnapshot to content that can be saved as utkast.
  const aktivPlanFormSnapshot = aktivPlanResponse.oppfolgingsplan.content;

  const planContent = extractValuesFromFormSnapshot(aktivPlanFormSnapshot);
  const convertedPlanContent = convertPlanContentToCurrentSchema(planContent);

  // Save utkast
  const lagreUtkastResult = await lagreUtkastServerAction(
    narmesteLederId,
    convertedPlanContent,
  );

  if (lagreUtkastResult.error) {
    return lagreUtkastResult;
  } else {
    // Redirect to ny plan page on success
    return redirect(getAGOpprettNyPlanHref(narmesteLederId));
  }
}
