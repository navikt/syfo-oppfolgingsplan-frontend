import { Metadata } from "next";
import Script from "next/script";
import "@navikt/dinesykmeldte-sidemeny/dist/dinesykmeldte-sidemeny.css";
import { Theme } from "@navikt/ds-react";
import "@/app/globals.css";
import { fetchEmployeeDetailsForAG } from "@/server/fetchData/arbeidsgiver/fetchEmployeeDetailsForAG";
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

  const { fnr, name } = await fetchEmployeeDetailsForAG(narmesteLederId);

  const employeeName = name || "Sykmeldt";

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
          employeeFnr={fnr}
          employeeName={employeeName}
        >
          <Theme>
            <main className="w-[730px]">{children}</main>
          </Theme>
        </ArbeidsgiverPageContainer>

        <Decorator.Footer />

        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
