import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  ConvertedLagretUtkastResponse,
  rawUtkastResponseForAGSchema,
} from "@/schema/utkastResponseSchema";
import { getRedirectAfterLoginUrlForAG } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchGet } from "@/server/tokenXFetch/tokenXFetchGet";
import { convertPlanContentToCurrentSchema } from "@/utils/convertPlanContentToCurrentSchema";
import { mockUtkastResponse } from "../mockData/mockUtkastData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchUtkastDataForAG(
  narmesteLederId: string,
): Promise<ConvertedLagretUtkastResponse> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockUtkastResponse;
  }

  const lagretUtkastResponse = await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    responseDataSchema: rawUtkastResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });

  if (lagretUtkastResponse.utkast) {
    const rawUtkastResponseContent = lagretUtkastResponse.utkast.content;
    const convertedUtkast = convertPlanContentToCurrentSchema(
      rawUtkastResponseContent,
    );

    return {
      ...lagretUtkastResponse,
      utkast: {
        ...lagretUtkastResponse.utkast,
        content: convertedUtkast,
      },
    };
  } else {
    return {
      ...lagretUtkastResponse,
      utkast: null,
    };
  }
}
