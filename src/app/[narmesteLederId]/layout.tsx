import { Metadata } from "next";
import Script from "next/script";
import "@navikt/dinesykmeldte-sidemeny/dist/dinesykmeldte-sidemeny.css";
import "@navikt/lumi-survey/styles.css";
import { Theme } from "@navikt/ds-react";
import "@/app/globals.css";
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

  // This fetch is also done in server components for the oversikt page, so when
  // visiting the oversikt page first, all these fetch calls made from different
  // server components (this component included) will be deduplicated by
  // Next.js.
  const oversiktResult =
    await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  const employeeName = oversiktResult.data?.employee.name || "Sykmeldt";

  const Decorator = await fetchDecoratorForAG(narmesteLederId, employeeName);

  return (
    <html lang="no">
      <head>
        <title>Oppfolgingsplan</title>
        <Decorator.HeadAssets />
      </head>

      <body>
        <Decorator.Header />
        <Instrumentation>
          <ArbeidsgiverPageContainer
            narmesteLederId={narmesteLederId}
            employeeFnr={oversiktResult.data?.employee.fnr || ""}
            employeeName={employeeName}
          >
            <Theme>
              <main className="max-w-[730px]">{children}</main>
            </Theme>
          </ArbeidsgiverPageContainer>
        </Instrumentation>

        <Decorator.Footer />

        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
