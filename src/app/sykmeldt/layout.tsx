import { Theme } from "@navikt/ds-react";
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { NaisMetaTags } from "@nais/apm/react";
import {
  DEFAULT_DEMO_SCENARIO,
  DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  parseDemoScenario,
  parseDemoTiltakspakkeVariant,
  resolveDemoScenario,
  SM_SCENARIO_OPTIONS,
} from "@/common/demoScenario";
import { DemoBanner } from "@/components/DemoBanner/DemoBanner";
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
  let initialVariant = DEFAULT_DEMO_TILTAKSPAKKE_VARIANT;
  let initialScenario = DEFAULT_DEMO_SCENARIO;

  if (isLocalOrDemo) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    initialVariant = parseDemoTiltakspakkeVariant(
      cookieStore.get(DEMO_TILTAKSPAKKE_VARIANT_COOKIE)?.value,
    );
    initialScenario = resolveDemoScenario(
      SM_SCENARIO_OPTIONS,
      parseDemoScenario(cookieStore.get(DEMO_SCENARIO_COOKIE)?.value),
      initialVariant,
    );
  }

  const Decorator = await fetchDecoratorForSM();

  return (
    <html lang="no">
      <head>
        <NaisMetaTags />
        <Decorator.HeadAssets />
        <Preload />
      </head>

      <body>
        <Decorator.Header />

        <Instrumentation>
          <Theme>
            {isLocalOrDemo && (
              <DemoBanner
                initialScenario={initialScenario}
                initialVariant={initialVariant}
                scenarios={SM_SCENARIO_OPTIONS}
              />
            )}
            <BreadcrumbsUpdaterForSM />
            <MainContent>{children}</MainContent>
          </Theme>
        </Instrumentation>

        <Decorator.Footer />

        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
