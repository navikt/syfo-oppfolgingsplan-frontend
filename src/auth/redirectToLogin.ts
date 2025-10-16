import { publicEnv } from "@/env-variables/publicEnv";
import { redirect } from "next/navigation";

export const redirectToLogin = (narmestelederid: string) => {
  const loginPath = `/oauth2/login/redirect?redirect=${encodeURIComponent(
    `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oppfolgingsplan/${narmestelederid}`
  )}`;
  return redirect(loginPath);
};
