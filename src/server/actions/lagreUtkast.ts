"use server";

import z from "zod";
import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  type OppfolgingsplanFormUnderArbeid,
  oppfolgingsplanFormUnderArbeidSchema,
} from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import { now } from "@/utils/dateAndTime/dateUtils";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import type { FetchUpdateResultWithResponse } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetch/tokenXFetchUpdate";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";
import { logServerActionInputValidationError } from "./logServerActionInputValidationError";
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
  const { success: isFormValuesValid, data: validatedFormValues } =
    oppfolgingsplanFormUnderArbeidSchema.safeParse(formValues);

  if (!(isNarmesteLederIdValid && isFormValuesValid)) {
    logServerActionInputValidationError({
      eventType: RuntimeErrorEvent.OPPFOLGINGSPLAN_UTKAST_SAVE_FAILED,
      validationTarget:
        !isNarmesteLederIdValid && !isFormValuesValid
          ? "narmeste_leder_id_and_payload"
          : !isNarmesteLederIdValid
            ? "narmeste_leder_id"
            : "payload",
    });

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
    eventType: RuntimeErrorEvent.OPPFOLGINGSPLAN_UTKAST_SAVE_FAILED,
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    method: "PUT",
    requestBody,
    responseDataSchema: lagreUtkastResponseSchema,
  });
}
