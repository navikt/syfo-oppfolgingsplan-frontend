import type { Metadata } from "next";
import Script from "next/script";
import "@navikt/dinesykmeldte-sidemeny/dist/dinesykmeldte-sidemeny.css";
import { Theme } from "@navikt/ds-react";
import "@/app/globals.css";
import { NaisMetaTags } from "@nais/apm/react";
import {
  AG_SCENARIO_OPTIONS,
  DEFAULT_DEMO_SCENARIO,
  DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  parseDemoScenario,
  parseDemoTiltakspakkeVariant,
  resolveDemoScenario,
} from "@/common/demoScenario";
import { DemoBanner } from "@/components/DemoBanner/DemoBanner";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { ArbeidsgiverPageContainer } from "@/ui/layout/ArbeidsgiverPageContainer";
import { fetchDecoratorForAG } from "@/ui/layout/fetchDecoratorHelpers";
import { Instrumentation } from "../../instrumentation/Instrumentation";

export const metadata: Metadata = {
  title: "Oppfølgingsplan",
};

export default async function RootLayoutForAG({
  params,
  children,
}: LayoutProps<"/[narmesteLederId]">) {
  const { narmesteLederId } = await params;
  let initialVariant = DEFAULT_DEMO_TILTAKSPAKKE_VARIANT;
  let initialScenario = DEFAULT_DEMO_SCENARIO;

  if (isLocalOrDemo) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    initialVariant = parseDemoTiltakspakkeVariant(
      cookieStore.get(DEMO_TILTAKSPAKKE_VARIANT_COOKIE)?.value,
    );
    initialScenario = resolveDemoScenario(
      AG_SCENARIO_OPTIONS,
      parseDemoScenario(cookieStore.get(DEMO_SCENARIO_COOKIE)?.value),
      initialVariant,
    );
  }

  // This fetch is also done in server components for the oversikt page. The
  // function is wrapped in React cache(), so all calls made from different
  // server components (this component included) during the same render pass
  // share one backend request. (Next.js' own fetch memoization does not apply
  // here, since every request gets a unique Nav-Call-Id header.)
  const oversiktResult =
    await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  const employeeName = oversiktResult.data?.employee.name || "Sykmeldt";

  const Decorator = await fetchDecoratorForAG(narmesteLederId, employeeName);

  return (
    <html lang="no">
      <head>
        <title>Oppfolgingsplan</title>
        <NaisMetaTags />
        <Decorator.HeadAssets />
      </head>

      <body>
        <Decorator.Header />
        <Instrumentation>
          <Theme>
            {isLocalOrDemo && (
              <DemoBanner
                initialScenario={initialScenario}
                initialVariant={initialVariant}
                scenarios={AG_SCENARIO_OPTIONS}
              />
            )}
            <ArbeidsgiverPageContainer
              narmesteLederId={narmesteLederId}
              employeeFnr={oversiktResult.data?.employee.fnr || ""}
              employeeName={employeeName}
            >
              <main className="max-w-[730px]">{children}</main>
            </ArbeidsgiverPageContainer>
          </Theme>
        </Instrumentation>

        <Decorator.Footer />

        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
