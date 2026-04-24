import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const lumiSurveySM: LumiSurveyConfig = {
  type: "rating",
  questions: [
    {
      id: "nytteverdi",
      type: "rating",
      variant: "emoji",
      required: true,
      prompt: "Er oppfølgingsplanen til hjelp for deg?",
      description:
        "Svarene du sender inn er anonyme, og blir brukt til videreutvikling av oppfølgingsplanen.",
    },
    {
      id: "nytteverdi-utdypning",
      type: "text",
      prompt:
        "Beskriv gjerne hva som gjør at den er til hjelp/ikke til hjelp for deg?",
      required: false,
      minRows: 3,
      maxLength: 500,
    },
    {
      id: "gjenkjennelse",
      type: "singleChoice",
      required: true,
      prompt: "Kjenner du deg igjen i innholdet i planen?",
      options: [
        {
          value: "ja",
          label: "Ja",
        },
        {
          value: "nei",
          label: "Nei",
        },
      ],
    },
    {
      id: "gjenkjennelse-utdypning",
      type: "text",
      prompt: "Beskriv gjerne hvorfor?",
      required: false,
      minRows: 3,
      maxLength: 500,
      visibleIf: {
        questionId: "gjenkjennelse",
        operator: "EQ",
        value: "nei",
      },
    },
  ],
};
