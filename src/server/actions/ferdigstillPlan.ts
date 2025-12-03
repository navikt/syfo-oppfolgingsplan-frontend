"use server";

import { redirect } from "next/navigation";
import z from "zod";
import { logger } from "@navikt/next-logger";
import { getEndpointOppfolgingsplanerForAG } from "@/common/backend-endpoints";
import { getAGAktivPlanNyligOpprettetHref } from "@/common/route-hrefs";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { createFormSnapshot } from "@/utils/FormSnapshot/createFormSnapshot";
import { getOppfolgingsplanFormShape } from "@/utils/getOppfolgingsplanFormShape";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResult } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";
import {
  ferdigstillPlanActionPayloadSchema,
  isNonEmptyString,
} from "./serverActionsInputValidation";

export async function ferdigstillPlanServerAction(
  narmesteLederId: string,
  payload: z.infer<typeof ferdigstillPlanActionPayloadSchema>,
): Promise<FetchUpdateResult> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return redirect(getAGAktivPlanNyligOpprettetHref(narmesteLederId));
  }

  // Input validation
  const isNarmesteLederIdValid = isNonEmptyString(narmesteLederId);
  const {
    success: isPayloadValid,
    data: validatedPayload,
    error: inputValidationError,
  } = ferdigstillPlanActionPayloadSchema.safeParse(payload);

  if (!(isNarmesteLederIdValid && isPayloadValid)) {
    if (!isNarmesteLederIdValid) {
      logger.error(
        `ferdigstillPlanServerAction invalid narmesteLederId: ${narmesteLederId}`,
      );
    }
    if (!isPayloadValid) {
      logger.error(
        `ferdigstillPlanServerAction payload validation error: ${inputValidationError.message}`,
      );
      return {
        error: {
          type: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR,
        },
      };
    }
  }

  const {
    formValues,
    evalueringsDatoIsoString,
    includeIkkeMedvirketBegrunnelseFieldInFormSnapshot,
  } = validatedPayload;

  // Create form snapshot
  const formShape = getOppfolgingsplanFormShape(
    includeIkkeMedvirketBegrunnelseFieldInFormSnapshot,
  );
  const formSnapshot = createFormSnapshot(formShape, formValues);

  const fetchResult = await tokenXFetchUpdate({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointOppfolgingsplanerForAG(narmesteLederId),
    requestBody: {
      content: formSnapshot,
      evalueringsdato: evalueringsDatoIsoString,
    },
  });

  if (fetchResult.error) {
    return fetchResult;
  } else {
    // Redirect to aktiv plan page on success
    return redirect(getAGAktivPlanNyligOpprettetHref(narmesteLederId));
  }
}
