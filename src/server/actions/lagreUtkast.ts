"use server";

import z from "zod";
import { logger } from "@navikt/next-logger";
import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { StandardActionErrorType } from "@/common/types/errors.ts";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  OppfolgingsplanFormAndUtkastSchema,
  OppfolgingsplanFormUnderArbeid,
} from "@/schema/oppfolgingsplanFormSchemas";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import { FetchUpdateResultWithResponse } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetch/tokenXFetchUpdate";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";
import { isNonEmptyString } from "./serverActionsInputValidation";

const lagreUtkastResponseSchema = z.object({
  sistLagretTidspunkt: z.iso.datetime().nullable(),
});

type LagreUtkastResponse = z.infer<typeof lagreUtkastResponseSchema>;

interface LagreUtkastRequestBody {
  content: OppfolgingsplanFormUnderArbeid;
}

export async function lagreUtkastServerAction(
  narmesteLederId: string,
  formValues: OppfolgingsplanFormUnderArbeid,
): Promise<
  FetchUpdateResultWithResponse<LagreUtkastResponse, StandardActionErrorType>
> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      success: true,
      data: { sistLagretTidspunkt: now().toISOString() },
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
      success: false,
      error: {
        type: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR,
      },
    };
  }

  const requestBody: LagreUtkastRequestBody = {
    content: validatedFormValues,
  };

  return (await tokenXFetchUpdateWithResponse({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    method: "PUT",
    requestBody,
    responseDataSchema: lagreUtkastResponseSchema,
  })) as FetchUpdateResultWithResponse<
    LagreUtkastResponse,
    StandardActionErrorType
  >;
}
