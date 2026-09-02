"use server";

import { redirect } from "next/navigation";
import type z from "zod";
import { getEndpointOppfolgingsplanerForAG } from "@/common/backend-endpoints";
import { getAGAktivPlanNyligOpprettetHref } from "@/common/route-hrefs";
import { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { createFormSnapshot } from "@/utils/FormSnapshot/createFormSnapshot";
import { getOppfolgingsplanFormShape } from "@/utils/getOppfolgingsplanFormShape";
import { TokenXTargetApi } from "../auth/tokenXExchange";
import { simulateBackendDelay } from "../fetchData/mockData/simulateBackendDelay";
import type { FetchUpdateResult } from "../tokenXFetch/FetchResult";
import { tokenXFetchUpdate } from "../tokenXFetch/tokenXFetchUpdate";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";
import { logServerActionInputValidationError } from "./logServerActionInputValidationError";
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
  const payloadValidation =
    ferdigstillPlanActionPayloadSchema.safeParse(payload);

  if (!(isNarmesteLederIdValid && payloadValidation.success)) {
    logServerActionInputValidationError({
      eventType: RuntimeErrorEvent.OPPFOLGINGSPLAN_FERDIGSTILLING_FAILED,
      validationTarget:
        !isNarmesteLederIdValid && !payloadValidation.success
          ? "narmeste_leder_id_and_payload"
          : !isNarmesteLederIdValid
            ? "narmeste_leder_id"
            : "payload",
      validationError: payloadValidation.success
        ? undefined
        : payloadValidation.error,
      validationSchema: ferdigstillPlanActionPayloadSchema,
    });
    return {
      error: {
        type: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR,
      },
    };
  }

  const validatedPayload = payloadValidation.data;

  const {
    formValues,
    evalueringsDatoIsoString,
    includeIkkeMedvirketBegrunnelseFieldInFormSnapshot,
    evalueringPaaminnelse,
  } = validatedPayload;

  // Create form snapshot
  const formShape = getOppfolgingsplanFormShape(
    includeIkkeMedvirketBegrunnelseFieldInFormSnapshot,
  );
  const formSnapshot = createFormSnapshot(
    formShape,
    formValues,
    evalueringPaaminnelse,
  );

  const fetchResult = await tokenXFetchUpdate({
    eventType: RuntimeErrorEvent.OPPFOLGINGSPLAN_FERDIGSTILLING_FAILED,
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
