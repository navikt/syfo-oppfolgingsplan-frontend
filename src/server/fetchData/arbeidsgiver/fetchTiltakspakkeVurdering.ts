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
  type FetchGetResult,
  fetchResultErrorSchema,
} from "@/server/tokenXFetch/FetchResult";

export const ORGNUMMER_REGEX = /^\d{9}$/;
const FLAGGSKIPET_FETCH_TIMEOUT_MS = 5000;

const NAV_CONSUMER_ID_REQUEST_HEADER = "syfo-oppfolgingsplan-frontend";

const getFlaggskipetRequestHeaders = () => ({
  "Content-Type": "application/json",
  "Nav-Consumer-Id": NAV_CONSUMER_ID_REQUEST_HEADER,
  "Nav-Call-Id": nanoid(),
});

async function getErrorResultFromNonOkResponse(response: Response) {
  try {
    const errorResponseJson = await response.json();
    return fetchResultErrorSchema.parse(errorResponseJson);
  } catch {
    return {
      type: FrontendErrorType.FETCH_UNKOWN_ERROR_RESPONSE,
    };
  }
}

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
      signal: AbortSignal.timeout(FLAGGSKIPET_FETCH_TIMEOUT_MS),
    });
  } catch {
    return {
      error: {
        type: FrontendErrorType.FETCH_NETWORK_ERROR,
      },
      data: null,
    };
  }

  if (!response.ok) {
    return {
      error: await getErrorResultFromNonOkResponse(response),
      data: null,
    };
  }

  let responseJson: unknown;

  try {
    responseJson = await response.json();
  } catch {
    return {
      error: {
        type: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
      },
      data: null,
    };
  }

  const parsedResponse =
    flaggskipetVurderingResponseSchema.safeParse(responseJson);

  if (parsedResponse.success) {
    return {
      error: null,
      data: parsedResponse.data,
    };
  }

  return {
    error: {
      type: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
    },
    data: null,
  };
}
