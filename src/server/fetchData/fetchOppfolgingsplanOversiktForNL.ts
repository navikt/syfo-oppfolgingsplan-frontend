import { getServerEnv, isLocalOrDemo } from "@/constants/envs.ts";
import {
  OppfolgingsplanerDataForOversikt,
  oppfolgingsplanOverviewSchema,
} from "@/schema/oppfolgingsplanOversiktSchema";
import { tokenXFetchGet } from "../tokenXFetch";
import { TokenXAudience } from "./helpers";
import { mockOversiktData } from "./demoMockData/mockOversiktData";

const getEndpointOppfolgingsplanerOversiktForNL = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/oversikt`;

export async function fetchOppfolgingsplanOversiktForNL(
  narmesteLederId: string
): Promise<OppfolgingsplanerDataForOversikt> {
  if (isLocalOrDemo) {
    return mockOversiktData;
  }

  return await tokenXFetchGet({
    audience: TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointOppfolgingsplanerOversiktForNL(narmesteLederId),
    responseDataSchema: oppfolgingsplanOverviewSchema,
    narmesteLederIdIfAG: narmesteLederId,
  });
}
