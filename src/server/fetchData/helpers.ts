import { getServerEnv } from "@/env-variables/serverEnv";
import { nanoid } from "nanoid";

const NAV_CONSUMER_ID_REQUEST_HEADER = "syfo-oppfolgingsplan-frontend";

export enum TokenXAudience {
  SYFO_OPPFOLGINGSPLAN_BACKEND = "SYFO_OPPFOLGINGSPLAN_BACKEND",
  SYFO_DINE_SYKMELDTE_BACKEND = "SYFO_DINE_SYKMELDTE_BACKEND",
}

export const getBackendRequestHeaders = (oboToken: string) => ({
  Authorization: `Bearer ${oboToken}`,
  // TODO: hvor er dette dokumentert?
  "Nav-Consumer-Id": NAV_CONSUMER_ID_REQUEST_HEADER,
  // trengs dette? hvor er det dokumentert?
  "Nav-Call-Id": nanoid(),
  "Content-Type": "application/json",
});

export const audienceClientIdMap: Record<TokenXAudience, string> = {
  [TokenXAudience.SYFO_OPPFOLGINGSPLAN_BACKEND]:
    getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID,
  [TokenXAudience.SYFO_DINE_SYKMELDTE_BACKEND]:
    getServerEnv().DINESYKMELDTE_BACKEND_CLIENT_ID,
};
