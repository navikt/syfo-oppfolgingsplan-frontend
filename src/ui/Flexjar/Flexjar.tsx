"use client";

import {
  FlexJarDock,
  type FlexJarSurveyConfig,
  type FlexJarTransport,
} from "@navikt/flexjar-widget";
import { submitFlexjarFeedback } from "@/server/actions/submitFlexjarFeedback";

const transport: FlexJarTransport = {
  async submit(submission) {
    await submitFlexjarFeedback(submission.transportPayload);
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
