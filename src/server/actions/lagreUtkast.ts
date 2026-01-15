"use server";

import z from "zod";
import { logger } from "@navikt/next-logger";
import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  OppfolgingsplanFormUnderArbeid,
  oppfolgingsplanFormUnderArbeidSchema,
} from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResultWithResponse } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetch/tokenXFetchUpdate";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";
import { isNonEmptyString } from "./serverActionsInputValidation";

const lagreUtkastResponseSchema = z.object({
  sistLagretTidspunkt: z.iso.datetime(),
});

type LagreUtkastResponse = z.infer<typeof lagreUtkastResponseSchema>;

interface LagreUtkastRequestBody {
  content: OppfolgingsplanFormUnderArbeid;
}

export async function lagreUtkastServerAction(
  narmesteLederId: string,
  formValues: OppfolgingsplanFormUnderArbeid,
): Promise<FetchUpdateResultWithResponse<LagreUtkastResponse>> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      error: null,
      data: { sistLagretTidspunkt: now().toISOString() },
    };
  }

  // Input validation
  const isNarmesteLederIdValid = isNonEmptyString(narmesteLederId);
  const {
    success: isFormValuesValid,
    data: validatedFormValues,
    error: inputValidationError,
  } = oppfolgingsplanFormUnderArbeidSchema.safeParse(formValues);

  if (!(isNarmesteLederIdValid && isFormValuesValid)) {
    if (!isNarmesteLederIdValid) {
      logger.error(
        `lagreUtkastServerAction invalid narmesteLederId: ${narmesteLederId}`,
      );
    }

    if (!isFormValuesValid) {
      logger.error(
        `lagreUtkastServerAction formValues validation error: ${inputValidationError.message}`,
      );
    }

    return {
      error: {
        type: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR,
      },
      data: null,
    };
  }

  const requestBody: LagreUtkastRequestBody = {
    content: validatedFormValues,
  };

  return await tokenXFetchUpdateWithResponse({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    method: "PUT",
    requestBody,
    responseDataSchema: lagreUtkastResponseSchema,
  });
}
