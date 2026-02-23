import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const lumiSurveySM: LumiSurveyConfig = {
  type: "rating",
  questions: [
    {
      id: "plan-til-hjelp",
      type: "rating",
      variant: "emoji",
      prompt: "Er oppfølgingsplanen til hjelp for deg?",
      description: "Alle tilbakemeldinger er til stor nytte for oss",
    },
    {
      id: "begrunnelse",
      type: "text",
      prompt: "Legg gjerne til en begrunnelse",
      description: "Alle tilbakemeldinger er til stor nytte for oss",
      required: false,
      minRows: 3,
      maxLength: 500,
      visibleIf: {
        questionId: "plan-til-hjelp",
        operator: "EXISTS",
      },
    },
  ],
};
