import z from "zod";
import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { TokenXTargetApi } from "@/server/helpers";
import { tokenXFetchGet } from "@/server/tokenXFetch";
import { mockUtkastData } from "../demoMockData/mockUtkastData";
import { simulateBackendDelay } from "../demoMockData/simulateBackendDelay";

const getEndpointUtkastForAG = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/utkast`; // TODO

export type UtkastData = {
  savedFormValues: OppfolgingsplanForm | null;
  lastSavedTime: Date | null;
};

export async function fetchUtkastDataForAG(
  narmesteLederId: string,
): Promise<UtkastData> {
  if (isLocalOrDemo) {
    await simulateBackendDelay();
    return mockUtkastData;
  }

  await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    responseDataSchema: z.object({}), // TODO: define schema
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });

  // map utkastResponse to UtkastData

  return mockUtkastData;
}
