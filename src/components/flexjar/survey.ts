import {
  type FlexJarFollowUpQuestion,
  type FlexJarMainQuestion,
  type FlexJarSurveyConfig,
  type RatingQuestion,
} from "@navikt/flexjar-widget";

const ratingQuestion: RatingQuestion = {
  id: "svar",
  type: "rating",
  prompt: "Hvordan var opplevelsen?",
};

const mainQuestion: FlexJarMainQuestion = {
  id: "feedback",
  type: "text",
  prompt: "Hva tenker du om denne tjenesten?",
  minRows: 3,
};

const followUpQuestions: FlexJarFollowUpQuestion[] = [
  {
    id: "channel",
    type: "singleChoice",
    prompt: "Hvor planlegger du å bruke Flexjar?",
    options: [
      { value: "internal", label: "Interne flater" },
      { value: "public", label: "nav.no" },
    ],
  },
  {
    id: "pain-points",
    type: "multiChoice",
    prompt: "Hva bør vi forbedre først?",
    description: "Velg alle som gjelder.",
    options: [
      { value: "copy", label: "Tekst og innhold" },
      { value: "design", label: "Design og tilgjengelighet" },
      { value: "integrations", label: "Integrasjoner" },
      { value: "analytics", label: "Analyse og målinger" },
    ],
  },
  {
    id: "details",
    type: "text",
    prompt: "Fortell oss mer om behovene dine.",
    description: "Den informasjonen hjelper oss å prioritere riktig.",
    minRows: 2,
  },
];

export const survey: FlexJarSurveyConfig = {
  rating: ratingQuestion,
  mainQuestion,
  followUpQuestions,
};
