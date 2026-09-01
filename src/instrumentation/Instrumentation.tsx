"use client";

import { configureLogger } from "@navikt/next-logger";
import { publicEnv } from "@/env-variables/publicEnv";
import { ApmRouteTracker } from "./ApmRouteTracker";

configureLogger({
  basePath: publicEnv.NEXT_PUBLIC_BASE_PATH,
});

interface Props {
  children: React.ReactNode;
}

export const Instrumentation = ({ children }: Props) => {
  return (
    <>
      <ApmRouteTracker />
      {children}
    </>
  );
};
