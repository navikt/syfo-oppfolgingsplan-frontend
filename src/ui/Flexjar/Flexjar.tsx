"use client";

import {
  FlexJarDock,
  type FlexJarSurveyConfig,
  type FlexJarTransport,
} from "@navikt/flexjar-widget";

const transport: FlexJarTransport = {
  async submit(submission) {
    await fetch("/api/flexjar", {
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
