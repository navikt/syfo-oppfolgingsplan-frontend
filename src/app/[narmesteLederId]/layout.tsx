import { Metadata } from "next";
import Script from "next/script";
import "@navikt/dinesykmeldte-sidemeny/dist/dinesykmeldte-sidemeny.css";
import "@navikt/flexjar-widget/styles.css";
import { Theme } from "@navikt/ds-react";
import "@/app/globals.css";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversikt";
import { ArbeidsgiverPageContainer } from "@/ui/layout/ArbeidsgiverPageContainer";
import { fetchDecoratorForAG } from "@/ui/layout/fetchDecoratorHelpers";

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
  let employeeName: string;
  let employeeFnr: string;

  try {
    const { employee } =
      await fetchOppfolgingsplanOversiktForAG(narmesteLederId);
    employeeName = employee.name;
    employeeFnr = employee.fnr;
  } catch {
    employeeName = "Sykmeldt";
    employeeFnr = "";
  }

  const Decorator = await fetchDecoratorForAG(narmesteLederId, employeeName);

  return (
    <html lang="no">
      <head>
        <Decorator.HeadAssets />
      </head>

      <body>
        <Decorator.Header />

        <ArbeidsgiverPageContainer
          narmesteLederId={narmesteLederId}
          employeeFnr={employeeFnr}
          employeeName={employeeName}
        >
          <Theme>
            <main className="max-w-[730px]">{children}</main>
          </Theme>
        </ArbeidsgiverPageContainer>

        <Decorator.Footer />

        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
