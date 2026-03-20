"use client";

import { VStack } from "@navikt/ds-react";
import {
  type LumiSurveyBehavior,
  type LumiSurveyConfig,
  LumiSurveyDock,
  type LumiSurveyTransport,
} from "@navikt/lumi-survey";
import type { ReactElement } from "react";
import { submitLumiSurveyFeedback } from "@/server/actions/submitLumiSurveyFeedback.ts";

const transport: LumiSurveyTransport = {
  async submit(submission) {
    await submitLumiSurveyFeedback(submission.transportPayload);
  },
};

interface Props {
  feedbackId: string;
  behavior?: LumiSurveyBehavior;
  survey: LumiSurveyConfig;
}

const IntroBody = (): ReactElement => {
  return (
    <VStack gap="space-4">
      <p>
        Vi vil gjerne vite hvordan du opplevde å lage oppfølgingsplanen med
        lederen din.
      </p>
      <p>
        Svarene er anonyme. Håper du kan ta deg tid til å svare på noen
        spørsmål.
      </p>
    </VStack>
  );
};

export const Lumi = ({ feedbackId, behavior, survey }: Props) => (
  <LumiSurveyDock
    surveyId={feedbackId}
    survey={survey}
    transport={transport}
    behavior={behavior}
    intro={{
      title: "Hei!",
      body: <IntroBody />,
    }}
  />
);
