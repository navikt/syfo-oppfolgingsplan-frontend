import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  OppfolgingsplanerOversiktForSM,
  OppfolgingsplanerOversiktResponseSchemaForSM,
} from "@/schema/oversiktResponseSchemas";
import { getRedirectAfterLoginUrlForSM } from "@/server/auth/redirectToLogin";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchGet } from "@/server/tokenXFetch/tokenXFetchGet";
import { mockOversiktDataMedPlanerForSM } from "../mockData/mockOversiktData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchOppfolgingsplanOversiktForSM(): Promise<OppfolgingsplanerOversiktForSM> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockOversiktDataMedPlanerForSM;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/sykmeldt/oppfolgingsplaner/oversikt`,
    responseDataSchema: OppfolgingsplanerOversiktResponseSchemaForSM,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForSM(),
  });
}
