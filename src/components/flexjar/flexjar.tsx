"use client";

import {
  FlexJarGuidePanel,
  type FlexJarTransport,
} from "@navikt/flexjar-widget";
import { survey } from "@/components/flexjar/survey";
import { submitFlexjar } from "@/server/actions/submitFlexjar.ts";

const transport: FlexJarTransport = {
  async submit(submission) {
    const response = await submitFlexjar(submission.transportPayload);

    if (!response.success) {
      throw new Error("Failed to send feedback");
    }
  },
};

export const Flexjar = () => (
  <FlexJarGuidePanel
    feedbackId="oppfolgingsplan"
    width={"medium"}
    title="Gi tilbakemelding"
    intro="Svarene dine brukes til videre forbedringsarbeid."
    panelBody="Hei! Vi jobber med en ny og forbedret oppfølgingsplan i 2025. Har du to minutter til å dele behovene dine?"
    survey={survey}
    transport={transport}
  />
);
