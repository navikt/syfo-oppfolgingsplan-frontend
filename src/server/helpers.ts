import { getServerEnv } from "@/env-variables/serverEnv";
import { nanoid } from "nanoid";

const NAV_CONSUMER_ID_REQUEST_HEADER = "syfo-oppfolgingsplan-frontend";

export enum TokenXTargetApi {
  SYFO_OPPFOLGINGSPLAN_BACKEND = "SYFO_OPPFOLGINGSPLAN_BACKEND",
  DINE_SYKMELDTE_BACKEND = "DINE_SYKMELDTE_BACKEND",
}

export const getBackendRequestHeaders = (oboToken: string) => ({
  Authorization: `Bearer ${oboToken}`,
  // TODO: hvor er dette dokumentert?
  "Nav-Consumer-Id": NAV_CONSUMER_ID_REQUEST_HEADER,
  // trengs dette? hvor er det dokumentert?
  "Nav-Call-Id": nanoid(),
  "Content-Type": "application/json",
});

export function getClientIdForTokenXTargetApi(
  targetApi: TokenXTargetApi
): string {
  if (targetApi === TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND) {
    return getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID;
  } else if (targetApi === TokenXTargetApi.DINE_SYKMELDTE_BACKEND) {
    return getServerEnv().DINESYKMELDTE_BACKEND_CLIENT_ID;
  } else {
    return "" as never;
  }
}
