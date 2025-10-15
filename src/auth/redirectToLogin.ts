import { publicEnv } from "@/constants/envs";
import { redirect } from "next/navigation";

export const redirectToLoginForAG = (narmesteLederId: string) => {
  const loginPath = `/oauth2/login/redirect?redirect=${encodeURIComponent(
    `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oppfolgingsplan/${narmesteLederId}`
  )}`;
  return redirect(loginPath);
};

export const redirectToLoginForSM = () => {
  const loginPath = `/oauth2/login/redirect?redirect=${encodeURIComponent(
    `${publicEnv.NEXT_PUBLIC_BASE_PATH}/oppfolgingsplan/sykmeldt`
  )}`;
  return redirect(loginPath);
};
