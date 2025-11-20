import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { getEndpointUtkastForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { utkastResponseForAGSchema } from "@/schema/utkastResponseSchema";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchGet } from "@/server/tokenXFetch";
import { mockUtkastData } from "../mockData/mockUtkastData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export type UtkastData = {
  savedFormValues: OppfolgingsplanForm | null;
  lastSavedTime: Date | null;
};

export async function fetchUtkastDataForAG(
  narmesteLederId: string,
): Promise<UtkastData> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockUtkastData;
  }

  await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    responseDataSchema: utkastResponseForAGSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });

  // map utkastResponse to UtkastData

  return mockUtkastData;
}
