"use client";

import {
  FlexJarDock,
  type FlexJarSurveyConfig,
  type FlexJarTransport,
} from "@navikt/flexjar-widget";
import { publicEnv } from "@/env-variables/publicEnv";

const transport: FlexJarTransport = {
  async submit(submission) {
    await fetch(`${publicEnv.NEXT_PUBLIC_BASE_PATH}/api/flexjar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission.transportPayload),
    });
  },
};

interface Props {
  feedbackId: string;
  survey: FlexJarSurveyConfig;
}

export const Flexjar = ({ feedbackId, survey }: Props) => (
  <FlexJarDock
    feedbackId={feedbackId}
    survey={survey}
    transport={transport}
    position="bottom-right"
  />
);
