import { publicEnv } from "@/env-variables/publicEnv";
import { redirect } from "next/navigation";

export function getRedirectAfterLoginUrlForAG(narmesteLederId: string) {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oppfolgingsplan/${narmesteLederId}`;
}

export function getRedirectAfterLoginUrlForSM() {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oppfolgingsplan/sykmeldt`;
}

export const redirectToLogin = (redirectAfterLoginUrl: string) => {
  const loginPath = `/oauth2/login/redirect?redirect=${encodeURIComponent(
    redirectAfterLoginUrl
  )}`;

  return redirect(loginPath);
};
