import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  OppfolgingsplanOverview,
  oppfolgingsplanOverviewSchema,
} from "@/schema/oppfolgingsplanSchema";
import { tokenXFetchGet } from "../tokenXFetch";
import { TokenXAudience } from "../helpers";
import { mockOversiktData } from "./demoMockData/mockOversiktData";

const getEndpointOppfolgingsplanerOversiktForAG = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/oversikt`;

export async function fetchOppfolgingsplanOversiktForAG(
  narmesteLederId: string
): Promise<OppfolgingsplanOverview> {
  if (isLocalOrDemo) {
    return mockOversiktData;
  }

  return await tokenXFetchGet({
    audience: TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointOppfolgingsplanerOversiktForAG(narmesteLederId),
    responseDataSchema: oppfolgingsplanOverviewSchema,
    narmesteLederIdIfAG: narmesteLederId,
  });
}
