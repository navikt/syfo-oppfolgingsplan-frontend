import "server-only";
import { nanoid } from "nanoid";
import { getEndpointFlaggskipetVurdering } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  type FlaggskipetVurderingResponse,
  flaggskipetVurderingResponseSchema,
} from "@/schema/flaggskipetSchemas";
import { FrontendErrorType } from "@/server/actions/FrontendErrorTypeEnum";
import { mockFlaggskipetVurderingTiltaksgruppe } from "@/server/fetchData/mockData/mockFlaggskipetVurdering";
import { simulateBackendDelay } from "@/server/fetchData/mockData/simulateBackendDelay";
import {
  getAndLogErrorResultFromNonOkResponse,
  getAndLogFetchNetworkError,
} from "@/server/tokenXFetch/errorHandling";
import type { FetchGetResult } from "@/server/tokenXFetch/FetchResult";
import { validateResponseBody } from "@/server/tokenXFetch/validateResponseBody";

export const ORGNUMMER_REGEX = /^\d{9}$/;

const NAV_CONSUMER_ID_REQUEST_HEADER = "syfo-oppfolgingsplan-frontend";

const getFlaggskipetRequestHeaders = () => ({
  "Content-Type": "application/json",
  "Nav-Consumer-Id": NAV_CONSUMER_ID_REQUEST_HEADER,
  "Nav-Call-Id": nanoid(),
});

export async function fetchTiltakspakkeVurdering(
  orgnummer: string,
): Promise<FetchGetResult<FlaggskipetVurderingResponse>> {
  if (!ORGNUMMER_REGEX.test(orgnummer)) {
    return {
      error: {
        type: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR,
      },
      data: null,
    };
  }

  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      error: null,
      data: mockFlaggskipetVurderingTiltaksgruppe,
    };
  }

  const endpoint = getEndpointFlaggskipetVurdering();
  const method = "POST";
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method,
      body: JSON.stringify({ orgnumre: [orgnummer] }),
      headers: getFlaggskipetRequestHeaders(),
    });
  } catch (error) {
    return {
      error: getAndLogFetchNetworkError({ error, endpoint, method }),
      data: null,
    };
  }

  if (!response.ok) {
    return {
      error: await getAndLogErrorResultFromNonOkResponse({
        response,
        endpoint,
        method,
      }),
      data: null,
    };
  }

  const { success, validatedData } = await validateResponseBody({
    response,
    responseDataSchema: flaggskipetVurderingResponseSchema,
    endpoint,
    method,
  });

  if (success) {
    return {
      error: null,
      data: validatedData,
    };
  }

  return {
    error: {
      type: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
    },
    data: null,
  };
}
