import { Metadata } from "next";
import Script from "next/script";
import "@navikt/dinesykmeldte-sidemeny/dist/dinesykmeldte-sidemeny.css";
import { Theme } from "@navikt/ds-react";
import "@/app/globals.css";
import { fetchDecoratorForAG } from "@/common/components/layout/fetchDecoratorHelpers";
import { fetchOppfolgingsplanOversiktForAG } from "@/server/fetchData/arbeidsgiver/fetchOppfolgingsplanOversiktForAG";
import { ArbeidsgiverPageContainer } from "./_components/layout/ArbeidsgiverPageContainer";

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
  const { employee } = await fetchOppfolgingsplanOversiktForAG(narmesteLederId);

  const employeeName = employee.name;

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
          employeeFnr={employee.fnr}
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
