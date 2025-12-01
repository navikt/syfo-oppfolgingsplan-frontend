import { redirect } from "next/navigation";
import { publicEnv } from "@/env-variables/publicEnv";

export function getRedirectAfterLoginUrlForAG(narmesteLederId: string) {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oppfolgingsplan/${narmesteLederId}`;
}

export function getRedirectAfterLoginUrlForSM() {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oppfolgingsplan/sykmeldt`;
}

export const redirectToLogin = (redirectAfterLoginUrl: string) => {
  const loginPath = `/oauth2/login?redirect=${encodeURIComponent(
    redirectAfterLoginUrl,
  )}`;

  return redirect(loginPath);
};
