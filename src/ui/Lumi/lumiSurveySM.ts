import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const lumiSurveySM: LumiSurveyConfig = {
  type: "custom",
  questions: [
    {
      id: "opplevelse",
      type: "rating",
      variant: "emoji",
      required: true,
      prompt: "Hvordan opplevde du å lage oppfølgingsplanen med lederen din?",
      description:
        "Vi vil gjerne vite mer om opplevelsen din. Svarene er anonyme.",
    },
    {
      id: "samarbeid",
      type: "singleChoice",
      required: true,
      prompt: "Hvordan var samarbeidet om oppfølgingsplanen?",
      visibleIf: {
        field: "ANSWER",
        questionId: "opplevelse",
        operator: "EXISTS",
      },
      options: [
        {
          value: "sammen",
          label: "Vi satt sammen og lagde den",
        },
        {
          value: "snakket",
          label: "Vi snakket sammen, og lederen skrev den etterpå",
        },
        {
          value: "uten-meg",
          label: "Lederen lagde den uten at vi snakket om den",
        },
        {
          value: "annet",
          label: "Annet",
        },
      ],
    },
    {
      id: "samarbeid-annet",
      type: "text",
      prompt: "Fortell gjerne mer",
      required: false,
      minRows: 2,
      maxLength: 500,
      visibleIf: {
        field: "ANSWER",
        questionId: "samarbeid",
        operator: "EQ",
        value: "annet",
      },
    },
    {
      id: "behov",
      type: "rating",
      variant: "emoji",
      required: true,
      prompt: "Tar planen opp det som er viktig for deg?",
      description:
        "For eksempel tilrettelegging, arbeidstid eller arbeidsoppgaver",
      visibleIf: {
        field: "ANSWER",
        questionId: "samarbeid",
        operator: "EXISTS",
      },
    },
    {
      id: "hva-savner-du",
      type: "text",
      prompt: "Hva savner du i planen?",
      required: false,
      minRows: 2,
      maxLength: 500,
      visibleIf: {
        field: "ANSWER",
        questionId: "behov",
        operator: "LT",
        value: 4,
      },
    },
    {
      id: "hva-fungerer",
      type: "text",
      prompt: "Hva fungerer bra?",
      required: false,
      minRows: 2,
      maxLength: 500,
      visibleIf: {
        field: "ANSWER",
        questionId: "behov",
        operator: "GT",
        value: 3,
      },
    },
    {
      id: "deling-kunnskap",
      type: "singleChoice",
      required: true,
      prompt: "Visste du at lederen din kan dele planen med lege og Nav?",
      visibleIf: {
        field: "ANSWER",
        questionId: "behov",
        operator: "EXISTS",
      },
      options: [
        {
          value: "ja",
          label: "Ja",
        },
        {
          value: "nei",
          label: "Nei",
        },
        {
          value: "usikker",
          label: "Usikker",
        },
      ],
    },
    {
      id: "deling-holdning",
      type: "singleChoice",
      required: true,
      prompt: "Lederen din kan dele planen med lege og Nav uten at du godkjenner den. Hvor greit er dette for deg?",
      visibleIf: {
        field: "ANSWER",
        questionId: "deling-kunnskap",
        operator: "EXISTS",
      },
      options: [
        {
          value: "helt-greit",
          label: "Helt greit",
        },
        {
          value: "ganske-greit",
          label: "Ganske greit",
        },
        {
          value: "verken-eller",
          label: "Verken eller",
        },
        {
          value: "lite-greit",
          label: "Lite greit",
        },
        {
          value: "ikke-greit",
          label: "Ikke greit",
        },
      ],
    },
    {
      id: "forbedring",
      type: "singleChoice",
      required: false,
      prompt: "Hva ville vært viktigst for deg?",
      visibleIf: {
        field: "ANSWER",
        questionId: "deling-holdning",
        operator: "EXISTS",
      },
      options: [
        {
          value: "lese-for-deling",
          label: "Kunne lese planen før den deles videre",
        },
        {
          value: "gi-innspill",
          label: "Kunne gi flere innspill til planen",
        },
        {
          value: "godkjenne",
          label: "Måtte godkjenne planen før deling",
        },
        {
          value: "si-fra",
          label: "Lettere å si fra ved uenighet",
        },
        {
          value: "ingen-endring",
          label: "Ingen endring nødvendig",
        },
        {
          value: "annet",
          label: "Annet",
        },
      ],
    },
    {
      id: "annet",
      type: "text",
      prompt: "Har du noe annet du vil si om planen?",
      required: false,
      minRows: 2,
      maxLength: 500,
      visibleIf: {
        field: "ANSWER",
        questionId: "deling-holdning",
        operator: "EXISTS",
      },
    },
  ],
};
