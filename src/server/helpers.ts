import { getServerEnv } from "@/env-variables/serverEnv";
import { nanoid } from "nanoid";

const NAV_CONSUMER_ID_REQUEST_HEADER = "syfo-oppfolgingsplan-frontend";

export enum TokenXAudience {
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

export function getClientIdForTokenXAudience(audience: TokenXAudience): string {
  if (audience === TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND) {
    return getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID;
  } else if (audience === TokenXAudience.DINE_SYKMELDTE_BACKEND) {
    return getServerEnv().DINESYKMELDTE_BACKEND_CLIENT_ID;
  } else {
    return "" as never;
  }
}
