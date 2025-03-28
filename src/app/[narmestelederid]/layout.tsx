import "@/app/globals.css";
import React from "react";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";
import Script from "next/script";
import { publicEnv } from "@/constants/envs";
import { createBreadcrumbsAG } from "@/components/breadcrumbs/breadcrumbs";
import { fetchSykmeldt } from "@/server/fetch/fetchSykmeldt";

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
      context: "privatperson",
      logoutWarning: true,
      chatbot: false,
      chatbotVisible: false,
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
  const sykmeldt = await fetchSykmeldt(narmestelederid);
  const Decorator = await fetchDecorator(
    narmestelederid,
    sykmeldt.navn || "Sykmeldt",
  );

  return (
    <html lang="no">
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        {children}
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}

export const metadata = {
  title: "Oppfølgingsplan",
};
