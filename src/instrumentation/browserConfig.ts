import type { ConfigOptions } from "@nais/apm";
import { publicEnv } from "@/env-variables/publicEnv";

export const BROWSER_APM_APP = "syfo-oppfolgingsplan-frontend";
export const BROWSER_APM_NAMESPACE = "team-esyfo";
export const BROWSER_SESSION_SAMPLING_RATE = 1;
export const UNKNOWN_PAGE_ID = "/syk/oppfolgingsplan/{unknown}";

export const browserApmIdentity = {
  app: BROWSER_APM_APP,
  namespace: BROWSER_APM_NAMESPACE,
  version: publicEnv.NEXT_PUBLIC_VERSION,
  telemetryUrl: publicEnv.NEXT_PUBLIC_TELEMETRY_URL,
} satisfies ConfigOptions;
