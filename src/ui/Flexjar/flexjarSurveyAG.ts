import { type FlexJarSurveyConfig } from "@navikt/flexjar-widget";

export const flexjarSurveyAG: FlexJarSurveyConfig = {
  rating: {
    type: "rating",
    prompt: "Hvordan var det å bruke oppfølgingsplanen?",
    description:
      "Svarene du sender inn er anonyme, og blir brukt til videreutvikling av oppfølgingsplanen.",
  },
  mainQuestion: {
    type: "text",
    prompt:
      "Opplever du at oppfølgingsplanen er et nyttig verktøy for å følge opp den ansatte?",
    minRows: 3,
    maxLength: 500,
  },
  followUpQuestions: [
    {
      id: "hva-ville-du-endret",
      type: "text",
      prompt: "Hvis du kunne endre på noe, hva ville det vært?",
      minRows: 3,
      maxLength: 500,
      required: false,
    },
  ],
};
