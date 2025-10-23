import { getServerEnv } from "@/env-variables/serverEnv";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { SykmeldtInfo, sykmeldtInfoSchema } from "@/schema/sykmeldtSchema";
import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { tokenXFetchGet } from "../tokenXFetch";
import { getMockSykmeldtData } from "./demoMockData/mockSykmeldtData";
import { TokenXTargetApi } from "../helpers";

export async function fetchSykmeldtInfo(
  narmestelederid: string
): Promise<SykmeldtInfo> {
  if (isLocalOrDemo) {
    return getMockSykmeldtData(narmestelederid);
  }

  // TODO: Det kan være ryddigere å få dette fra oppfolgingsplan-backend i stedet for at
  // denne appen skal snakke med flere backend-tjenester.

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.DINE_SYKMELDTE_BACKEND,
    endpoint: `${getServerEnv().DINESYKMELDTE_BACKEND_HOST}/api/v2/dinesykmeldte/${narmestelederid}`,
    responseDataSchema: sykmeldtInfoSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmestelederid),
  });
}
