import { getServerEnv } from "@/env-variables/serverEnv";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { SykmeldtInfo, sykmeldtInfoSchema } from "@/schema/sykmeldtSchema";
import { tokenXFetchGet } from "../tokenXFetch";
import { TokenXAudience } from "./helpers";
import { getMockSykmeldtData } from "./demoMockData/mockSykmeldtData";

export async function fetchSykmeldtInfo(
  narmestelederid: string
): Promise<SykmeldtInfo> {
  if (isLocalOrDemo) {
    return getMockSykmeldtData(narmestelederid);
  }

  // TODO: Det kan være ryddigere å få dette fra oppfolgingsplan-backend i stedet for at
  // denne appen skal snakke med flere backend-tjenester.

  return await tokenXFetchGet({
    audience: TokenXAudience.SYFO_DINE_SYKMELDTE_BACKEND,
    endpoint: `${getServerEnv().DINESYKMELDTE_BACKEND_HOST}/api/v2/dinesykmeldte/${narmestelederid}`,
    responseDataSchema: sykmeldtInfoSchema,
    narmesteLederIdIfAG: narmestelederid,
  });
}
