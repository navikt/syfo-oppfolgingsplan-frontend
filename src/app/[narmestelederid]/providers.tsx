"use client";

import React from "react";
import { configureLogger } from "@navikt/next-logger";
import { initFaro } from "@/app/faro/faro/faro";
import { publicEnv } from "@/constants/envs";

configureLogger({
  basePath: publicEnv.NEXT_PUBLIC_BASE_PATH,
});

initFaro();

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return children;
};
