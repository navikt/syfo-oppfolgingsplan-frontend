import { ReactNode } from "react";
import { Metadata } from "next";
import Script from "next/script";
import { Theme } from "@navikt/ds-react";
import "@/app/globals.css";
import { fetchDecoratorForSM } from "@/common/components/layout/fetchDecoratorHelpers";
import { MainContentForSM } from "./_components/layout/MainContentForSM";
import Preload from "./preload";
import { Providers } from "./providers";

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

        <Theme>
          <Providers>
            <MainContentForSM>{children}</MainContentForSM>
          </Providers>
        </Theme>

        <Decorator.Footer />

        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
