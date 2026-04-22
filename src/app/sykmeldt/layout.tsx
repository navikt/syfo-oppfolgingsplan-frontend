import { Theme } from "@navikt/ds-react";
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { Suspense } from "react";
import "@navikt/lumi-survey/styles.css";
import "@/app/globals.css";
import { SM_SCENARIO_OPTIONS } from "@/common/demoScenario";
import { DemoScenarioPicker } from "@/components/DemoScenarioPicker/DemoScenarioPicker";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { Instrumentation } from "@/instrumentation/Instrumentation";
import { fetchDecoratorForSM } from "@/ui/layout/fetchDecoratorHelpers";
import { MainContent } from "@/ui/layout/MainContent";
import { BreadcrumbsUpdaterForSM } from "./_components/BreadcrumbsUpdaterForSM";
import Preload from "./preload";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Oppfølgingsplan",
};

export default async function RootLayoutForSM({
  children,
}: {
  children: ReactNode;
}) {
  const Decorator = await fetchDecoratorForSM();

  return (
    <html lang="no">
      <head>
        <Decorator.HeadAssets />
        <Preload />
      </head>

      <body>
        <Decorator.Header />

        <Instrumentation>
          <Theme>
            <BreadcrumbsUpdaterForSM />
            <MainContent>{children}</MainContent>
          </Theme>
        </Instrumentation>

        <Decorator.Footer />

        <Decorator.Scripts loader={Script} />

        {isLocalOrDemo && (
          <Suspense>
            <DemoScenarioPicker scenarios={SM_SCENARIO_OPTIONS} />
          </Suspense>
        )}
      </body>
    </html>
  );
}
