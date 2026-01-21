"use client";

import {
  type LumiSurveyConfig,
  LumiSurveyDock,
  type LumiSurveyTransport,
} from "@navikt/lumi-survey";
import { submitLumiSurveyFeedback } from "@/server/actions/submitLumiSurveyFeedback.ts";

const transport: LumiSurveyTransport = {
  async submit(submission) {
    await submitLumiSurveyFeedback(submission.transportPayload);
  },
};

interface Props {
  feedbackId: string;
  survey: LumiSurveyConfig;
}

export const Lumi = ({ feedbackId, survey }: Props) => (
  <LumiSurveyDock surveyId={feedbackId} survey={survey} transport={transport} />
);
