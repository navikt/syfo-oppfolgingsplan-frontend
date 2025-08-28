import "@navikt/dinesykmeldte-sidemeny/dist/dinesykmeldte-sidemeny.css";
import "@/app/globals.css";
import React from "react";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";
import { publicEnv } from "@/constants/envs";
import { createBreadcrumbsAG } from "@/components/breadcrumbs/breadcrumbs";
import { fetchSykmeldt } from "@/server/fetch/fetchSykmeldt";
import { SideMenuContainer } from "@/components/sideMenuContainer/sideMenuContainer";
import { logger } from "@navikt/next-logger";
import { redirectToLogin } from "@/auth/redirectToLogin";
import { fetchOppfolgingsplanOverviewForArbeidsgiver } from "@/server/fetch/fetchOppfolgingsplanOverview.ts";

function createDecoratorEnv(): "dev" | "prod" {
  switch (publicEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT) {
    case "local":
    case "test":
    case "dev":
      return "dev";
    default:
      return "prod";
  }
}

async function fetchDecorator(narmestelederid: string, sykmeldtNavn: string) {
  return await fetchDecoratorReact({
    env: createDecoratorEnv(),
    params: {
      language: "nb",
      context: "arbeidsgiver",
      logoutWarning: true,
      chatbot: true,
      chatbotVisible: true,
      feedback: false,
      redirectToApp: true,
      breadcrumbs: createBreadcrumbsAG(sykmeldtNavn, narmestelederid),
    },
  });
}

interface LayoutParams {
  narmestelederid: string;
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LayoutParams>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const narmestelederid = resolvedParams.narmestelederid;
  const sykmeldtResult = await fetchSykmeldt(narmestelederid);
  const oppfolgingsplanResult =
    await fetchOppfolgingsplanOverviewForArbeidsgiver(narmestelederid);

  if (oppfolgingsplanResult.success) {
    logger.info(
      `Fetched oppfolgingsplan overview:\n ${oppfolgingsplanResult.data}`,
    );
  }

  if (!sykmeldtResult.success) {
    logger.error(
      `Failed to fetch sykmeldt: ${sykmeldtResult.errorType} - ${sykmeldtResult.errorMessage}`,
    );

    if (sykmeldtResult.errorType === "UNAUTHORIZED") {
      redirectToLogin(narmestelederid);
    }

    throw new Error(
      `Failed to fetch data: ${sykmeldtResult.errorType} - ${sykmeldtResult.errorMessage}`,
    );
  }

  const Decorator = await fetchDecorator(
    narmestelederid,
    sykmeldtResult.data.navn || "Sykmeldt",
  );

  return (
    <html lang="no">
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        <SideMenuContainer sykmeldtData={sykmeldtResult.data}>
          {children}
        </SideMenuContainer>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}

export const metadata = {
  title: "Oppfølgingsplan",
};
