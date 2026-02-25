import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const lumiSurveyAG: LumiSurveyConfig = {
  type: "rating",
  questions: [
    {
      id: "hvordan-var-det-a-bruke",
      type: "rating",
      variant: "emoji",
      prompt: "Hvordan var det å bruke oppfølgingsplanen?",
      description:
        "Svarene du sender inn er anonyme, og blir brukt til videreutvikling av oppfølgingsplanen.",
    },
    {
      id: "nyttig-verktoy",
      type: "text",
      prompt:
        "Opplever du at oppfølgingsplanen er et nyttig verktøy for å følge opp den ansatte?",
      minRows: 3,
      maxLength: 500,
      required: true,
      visibleIf: {
        questionId: "hvordan-var-det-a-bruke",
        operator: "EXISTS",
      },
    },
    {
      id: "hva-ville-du-endret",
      type: "text",
      prompt: "Hvis du kunne endre på noe, hva ville det vært?",
      minRows: 3,
      maxLength: 500,
      required: false,
      visibleIf: {
        questionId: "hvordan-var-det-a-bruke",
        operator: "EXISTS",
      },
    },
  ],
};
