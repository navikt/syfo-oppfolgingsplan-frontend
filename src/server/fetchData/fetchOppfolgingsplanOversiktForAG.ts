import { getServerEnv } from "@/env-variables/serverEnv";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import {
  OppfolgingsplanerOversikt,
  oppfolgingsplanerOversiktSchema,
} from "@/schema/oppfolgingsplanerOversiktSchemas";
import { tokenXFetchGet } from "../tokenXFetch";
import { TokenXTargetApi } from "../helpers";
import { mockOversiktData } from "./demoMockData/mockOversiktData";

const getEndpointOppfolgingsplanerOversiktForAG = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/oversikt`;

export async function fetchOppfolgingsplanOversiktForAG(
  narmesteLederId: string
): Promise<OppfolgingsplanerOversikt> {
  if (isLocalOrDemo) {
    return mockOversiktData;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointOppfolgingsplanerOversiktForAG(narmesteLederId),
    responseDataSchema: oppfolgingsplanerOversiktSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });
}
