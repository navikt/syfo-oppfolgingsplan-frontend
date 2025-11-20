import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { getEndpointOversiktForAG } from "@/common/backend-endpoints";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import {
  OppfolgingsplanerOversiktForAG,
  OppfolgingsplanerOversiktResponseSchemaForAG,
} from "@/schema/oversiktResponseSchemas";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchGet } from "../../tokenXFetch";
import { mockOversiktDataMedPlaner } from "../mockData/mockOversiktData";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

export async function fetchOppfolgingsplanOversiktForAG(
  narmesteLederId: string,
): Promise<OppfolgingsplanerOversiktForAG> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();

    return mockOversiktDataMedPlaner;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointOversiktForAG(narmesteLederId),
    responseDataSchema: OppfolgingsplanerOversiktResponseSchemaForAG,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
