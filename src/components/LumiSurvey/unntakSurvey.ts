import type { SurveyDocumentV1 } from "@navikt/lumi-survey";

// Shared version from Surveyverksted for issue #1199.
// Copied unchanged with «Kopier TypeScript».
export const unntakSurvey = {
  authoringSchemaVersion: 1,
  pages: [
    {
      id: "sporsmal",
      questions: [
        {
          id: "sporsmal",
          maxLength: 1000,
          minRows: 4,
          prompt:
            "Hvordan opplevde du å få beskjed om at dere ikke trenger oppfølgingsplan nå?",
          required: true,
          type: "text",
        },
      ],
    },
    {
      id: "side-d110a9fc-cacc-4f53-98c9-6bc0b7a44aae",
      questions: [
        {
          id: "text-68dfd32f",
          maxLength: 1000,
          minRows: 4,
          prompt: "Hva kan vi gjøre bedre?",
          type: "text",
        },
      ],
    },
  ],
  type: "custom",
} satisfies SurveyDocumentV1;
