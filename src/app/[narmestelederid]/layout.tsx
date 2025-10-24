import { Metadata } from "next";
import Script from "next/script";
import { Theme } from "@navikt/ds-react";
import { fetchSykmeldtInfo } from "@/server/fetchData/fetchSykmeldtInfo";
import { SideMenuContainer } from "@/components/sideMenuContainer/sideMenuContainer";
import { fetchDecorator } from "./fetchDecoratorHelpers";
import "@navikt/dinesykmeldte-sidemeny/dist/dinesykmeldte-sidemeny.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Oppfølgingsplan",
};

export default async function RootLayoutForNL({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ narmestelederid: string }>;
}) {
  const { narmestelederid } = await params;
  const sykmeldtInfo = await fetchSykmeldtInfo(narmestelederid);

  const Decorator = await fetchDecorator(
    narmestelederid,
    sykmeldtInfo.navn || "Sykmeldt"
  );

  return (
    <html lang="no">
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        <SideMenuContainer sykmeldtInfo={sykmeldtInfo}>
          <Theme>
            <main className="w-[730px]">{children}</main>
          </Theme>
        </SideMenuContainer>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
