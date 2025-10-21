"use client";

import {
  Faro,
  getWebInstrumentations,
  initializeFaro,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { publicEnv } from "@/env-variables/publicEnv";

export const initFaro = (): Faro | null => {
  if (
    !publicEnv.NEXT_PUBLIC_TELEMETRY_URL ||
    typeof window === "undefined" ||
    isLocalOrDemo
  )
    return null;

  return initializeFaro({
    url: publicEnv.NEXT_PUBLIC_TELEMETRY_URL,
    app: {
      name: "syfo-oppfolgingsplan-frontend",
      version: publicEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT,
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: false,
      }),
      new TracingInstrumentation(),
    ],
  });
};
