import { getEndpointOversiktForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  OppfolgingsplanerOversiktForAG,
  OppfolgingsplanerOversiktResponseSchemaForAG,
} from "@/schema/oversiktResponseSchemas";
import { getRedirectAfterLoginUrlForAG } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { FetchGetResult } from "@/server/tokenXFetch/FetchResult";
import { tokenXFetchGetWithResult } from "@/server/tokenXFetch/tokenXFetchGetWithResult";
import { mockOversiktDataMedPlanerForAG } from "../mockData/mockOversiktData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchOppfolgingsplanOversiktForAG(
  narmesteLederId: string,
): Promise<FetchGetResult<OppfolgingsplanerOversiktForAG>> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return {
      error: null,
      data: mockOversiktDataMedPlanerForAG,
    };
  }

  return await tokenXFetchGetWithResult({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointOversiktForAG(narmesteLederId),
    responseDataSchema: OppfolgingsplanerOversiktResponseSchemaForAG,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
