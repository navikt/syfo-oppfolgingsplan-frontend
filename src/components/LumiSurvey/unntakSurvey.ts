import type { SurveyDocumentV1 } from "@navikt/lumi-survey";

// Surveyverksted revision 9dada0e2-f1fb-4299-adcb-4e61e74a938f (issue #1199).
// Copied unchanged with «Kopier TypeScript».
export const unntakSurvey = {
  authoringSchemaVersion: 1,
  pages: [
    {
      id: "side-6fc624ac-bbb2-48e2-b549-5a21009d7ba9",
      questions: [
        {
          id: "rating",
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
      id: "opplevelse",
      questions: [
        {
          id: "kommentar",
          maxLength: 1000,
          minRows: 4,
          prompt: "Hva kan vi gjøre bedre?",
          required: false,
          type: "text",
          visibleIf: {
            operator: "EXISTS",
            questionId: "rating",
          },
        },
      ],
    },
  ],
  type: "rating",
} satisfies SurveyDocumentV1;
