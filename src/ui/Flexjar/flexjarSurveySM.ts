import { type FlexJarSurveyConfig } from "@navikt/flexjar-widget";

export const flexjarSurveySM: FlexJarSurveyConfig = {
  rating: {
    type: "rating",
    prompt: "Er oppfølgingsplanen til hjelp for deg?",
    description:
      "Svarene du sender inn er anonyme, og blir brukt til videreutvikling av oppfølgingsplanen.",
  },
  mainQuestion: {
    type: "text",
    maxLength: 500,
    minRows: 4,
    prompt: "Legg gjerne til en begrunnelse (valgfritt)",
    description: "Alle tilbakemeldinger er til stor nytte for oss",
    required: false,
  },
};
