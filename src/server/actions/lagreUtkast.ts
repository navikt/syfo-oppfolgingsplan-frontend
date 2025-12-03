"use server";

import z from "zod";
import { logger } from "@navikt/next-logger";
import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  OppfolgingsplanForm,
  OppfolgingsplanFormAndUtkastSchema,
} from "@/schema/oppfolgingsplanFormSchemas";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResultWithResponse } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetch/tokenXFetchUpdate";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";
import { isNonEmptyString } from "./serverActionsInputValidation";

const lagreUtkastResponseSchema = z.object({
  sistLagretTidspunkt: z.iso
    .datetime()
    .transform((dateString) => new Date(dateString))
    .nullable(),
});

type LagreUtkastResponse = z.infer<typeof lagreUtkastResponseSchema>;

interface LagreUtkastRequestBody {
  content: OppfolgingsplanForm;
}

export async function lagreUtkastServerAction(
  narmesteLederId: string,
  formValues: Partial<OppfolgingsplanForm>,
): Promise<FetchUpdateResultWithResponse<LagreUtkastResponse>> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      error: null,
      data: { sistLagretTidspunkt: new Date() },
    };
  }

  // Input validation
  const isNarmesteLederIdValid = isNonEmptyString(narmesteLederId);
  const {
    success: isFormValuesValid,
    data: validatedFormValues,
    error: inputValidationError,
  } = OppfolgingsplanFormAndUtkastSchema.safeParse(formValues);

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
