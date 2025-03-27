import { logger } from "@navikt/next-logger";
import { NextResponse } from "next/server";
import { publicEnv } from "@/constants/envs";

export const navigateToLogin = () => {
  logger.info("User is not authenticated. Redirecting to login page");
  const redirectUrl = new URL(
    `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oauth2/login`,
  );
  redirectUrl.searchParams.set(
    "redirect",
    `${publicEnv.NEXT_PUBLIC_BASE_PATH}/snart-slutt-pa-sykepengene`,
  );
  return NextResponse.redirect(redirectUrl);
};
