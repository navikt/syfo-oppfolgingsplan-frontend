"use client";

import { configureLogger } from "@navikt/next-logger";
import { publicEnv } from "@/env-variables/publicEnv";
import { initFaro } from "@/instrumentation/faro";

configureLogger({
  basePath: publicEnv.NEXT_PUBLIC_BASE_PATH,
});

initFaro();

interface Props {
  children: React.ReactNode;
}

// Could return null or a fragment instead, instead of wrapping anything.
// But this way, context providers can be added later. Also, the wrapping
// makes it clearer that instrumentation is being applied to the wrapped tree.
export const Instrumentation = ({ children }: Props) => {
  return children;
};
