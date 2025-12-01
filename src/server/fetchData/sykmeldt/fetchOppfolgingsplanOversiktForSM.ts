import { getRedirectAfterLoginUrlForSM } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv.ts";
import {
  OppfolgingsplanerOversiktForSM,
  OppfolgingsplanerOversiktResponseSchemaForSM,
} from "@/schema/oversiktResponseSchemas";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchGet } from "../../tokenXFetch";
import { mockOversiktDataMedPlanerForSM } from "../mockData/mockOversiktData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchOppfolgingsplanOversiktForSM(): Promise<OppfolgingsplanerOversiktForSM> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockOversiktDataMedPlanerForSM;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/sykmeldt/oppfolgingsplaner`,
    responseDataSchema: OppfolgingsplanerOversiktResponseSchemaForSM,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForSM(),
  });
}
