import "server-only";
import { getEndpointFlaggskipetVurdering } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  type FlaggskipetVurderingResponse,
  flaggskipetVurderingResponseSchema,
} from "@/schema/flaggskipetSchemas";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { mockFlaggskipetVurderingTiltaksgruppe } from "@/server/fetchData/mockData/mockFlaggskipetVurdering";
import { simulateBackendDelay } from "@/server/fetchData/mockData/simulateBackendDelay";
import type { FetchGetResult } from "@/server/tokenXFetch/FetchResult";
import { tokenXFetchUpdateWithResponse } from "@/server/tokenXFetch/tokenXFetchUpdate";

const FLAGGSKIPET_FETCH_TIMEOUT_MS = 5000;

export async function fetchTiltakspakkeVurdering(
  orgnumre: readonly string[],
): Promise<FetchGetResult<FlaggskipetVurderingResponse>> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return { error: null, data: mockFlaggskipetVurderingTiltaksgruppe };
  }

  return await tokenXFetchUpdateWithResponse({
    targetApi: TokenXTargetApi.FLAGGSKIPET,
    endpoint: getEndpointFlaggskipetVurdering(),
    requestBody: { orgnumre },
    responseDataSchema: flaggskipetVurderingResponseSchema,
    signal: AbortSignal.timeout(FLAGGSKIPET_FETCH_TIMEOUT_MS),
  });
}
