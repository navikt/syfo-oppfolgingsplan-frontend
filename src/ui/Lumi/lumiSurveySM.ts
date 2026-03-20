import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const lumiSurveySM: LumiSurveyConfig = {
  type: "custom",
  questions: [
    {
      id: "opplevelse",
      type: "rating",
      variant: "emoji",
      required: true,
      prompt:
        "Hvordan opplevde du samarbeidet med lederen din da oppfølgingsplanen ble laget?",
      description:
        "Svarene du sender inn er anonyme, og blir brukt til videreutvikling av oppfølgingsplanen.",
    },
    {
      id: "samarbeid",
      type: "singleChoice",
      required: true,
      prompt:
        "Snakket du med lederen din om innholdet i planen før den ble laget?",
      options: [
        {
          value: "sammen",
          label: "Ja, vi satt sammen og lagde den",
        },
        {
          value: "snakket",
          label: "Ja, vi snakket sammen, og lederen min lagde den etterpå",
        },
        {
          value: "uten-meg",
          label: "Nei, lederen min lagde den uten at vi snakket sammen",
        },
        {
          value: "annet",
          label: "Annet",
        },
      ],
    },
    {
      id: "deling-holdning",
      type: "singleChoice",
      required: true,
      prompt:
        "Hva synes du om at lederen din kan dele planen med fastlegen din og Nav uten at du godkjenner den?",
      options: [
        {
          value: "helt-greit",
          label: "Helt greit",
        },
        {
          value: "greit",
          label: "Greit",
        },
        {
          value: "ikke-greit",
          label: "Ikke greit",
        },
      ],
    },
    {
      id: "annet",
      type: "text",
      prompt: "Er det noe du vil legge til?",
      required: false,
      minRows: 3,
      maxLength: 500,
    },
  ],
};
