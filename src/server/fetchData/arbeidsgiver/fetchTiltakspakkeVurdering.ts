import "server-only";
import { getEndpointFlaggskipetVurdering } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  type FlaggskipetVurderingResponse,
  flaggskipetVurderingResponseSchema,
} from "@/schema/flaggskipetSchemas";
import { FrontendErrorType } from "@/server/actions/FrontendErrorTypeEnum";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { mockFlaggskipetVurderingTiltaksgruppe } from "@/server/fetchData/mockData/mockFlaggskipetVurdering";
import { simulateBackendDelay } from "@/server/fetchData/mockData/simulateBackendDelay";
import type { FetchGetResult } from "@/server/tokenXFetch/FetchResult";
import { tokenXFetchUpdateWithResponse } from "@/server/tokenXFetch/tokenXFetchUpdate";

const ORGNUMMER_REGEX = /^\d{9}$/;
const FLAGGSKIPET_FETCH_TIMEOUT_MS = 5000;

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

  return await tokenXFetchUpdateWithResponse({
    targetApi: TokenXTargetApi.FLAGGSKIPET,
    endpoint: getEndpointFlaggskipetVurdering(),
    requestBody: {
      orgnumre: [orgnummer],
    },
    responseDataSchema: flaggskipetVurderingResponseSchema,
    signal: AbortSignal.timeout(FLAGGSKIPET_FETCH_TIMEOUT_MS),
  });
}
