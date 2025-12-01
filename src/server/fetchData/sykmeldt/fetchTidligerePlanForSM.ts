import { getRedirectAfterLoginUrlForSM } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  FerdigstiltPlanResponseForSM,
  ferdigstiltPlanResponseForSMSchema,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchGet } from "../../tokenXFetch";
import { getMockTidligerePlanDataForSM } from "../mockData/mockHelpers";
import { simulateBackendDelay } from "../mockData/simulateBackendDelay";

interface Props {
  id: string;
}

export async function fetchTidligerePlanForSM({
  id,
}: Props): Promise<FerdigstiltPlanResponseForSM> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return getMockTidligerePlanDataForSM(id);
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/sykmeldt/oppfolgingsplaner/${id}`,
    responseDataSchema: ferdigstiltPlanResponseForSMSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForSM(),
  });
}
