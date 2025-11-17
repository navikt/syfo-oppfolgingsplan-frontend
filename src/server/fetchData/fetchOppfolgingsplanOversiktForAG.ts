import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  OppfolgingsplanerOversikt,
  oppfolgingsplanerOversiktResponseSchema,
} from "@/schema/oppfolgingsplanerOversiktSchemas";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchGet } from "../tokenXFetch";
import { mockOversiktData } from "./demoMockData/mockOversiktData";
import { simulateBackendDelay } from "./demoMockData/simulateBackendDelay";

const getEndpointOppfolgingsplanerOversiktForAG = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/oversikt`;

export async function fetchOppfolgingsplanOversiktForAG(
  narmesteLederId: string
): Promise<OppfolgingsplanerOversikt> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockOversiktData;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointOppfolgingsplanerOversiktForAG(narmesteLederId),
    responseDataSchema: oppfolgingsplanerOversiktResponseSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
