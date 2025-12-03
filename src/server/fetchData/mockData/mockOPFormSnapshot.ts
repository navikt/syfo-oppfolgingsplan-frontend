import { FormSnapshot } from "@/utils/FormSnapshot/schemas/FormSnapshot";

export const mockPlanFormSnapshot: FormSnapshot = {
  formIdentifier: "oppfolgingsplan-navno",
  formSemanticVersion: "1.0.0",
  formSnapshotVersion: "2.0.0",
  sections: [
    {
      sectionId: "arbeidsoppgaver",
      sectionTitle: "Arbeidsoppgaver",
      fields: [
        {
          label: "Hvordan ser en vanlig arbeidsdag ut?",
          value:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          fieldId: "typiskArbeidshverdag",
          fieldType: "TEXT",
          description:
            "Beskriv hvilke arbeidsoppgaver den ansatte gjør på jobben.",
          wasRequired: true,
        },
        {
          label: "Hvilke arbeidsoppgaver kan fortsatt utføres?",
          value:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          fieldId: "arbeidsoppgaverSomKanUtfores",
          fieldType: "TEXT",
          description: null,
          wasRequired: true,
        },
        {
          label: "Hvilke arbeidsoppgaver kan ikke utføres?",
          value:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          fieldId: "arbeidsoppgaverSomIkkeKanUtfores",
          fieldType: "TEXT",
          description: null,
          wasRequired: true,
        },
      ],
    },
    {
      sectionId: "tilrettelegging",
      sectionTitle: "Tilrettelegging",
      fields: [
        {
          label: "Tilrettelegging tidligere i sykefraværet",
          value: "asdf",
          fieldId: "tidligereTilrettelegging",
          fieldType: "TEXT",
          description:
            "Beskriv hva dere har forsøkt av tilrettelegging så langt i sykefraværet. Hva har fungert,  hva har ikke fungert og hva må kanskje justeres.",
          wasRequired: true,
        },
        {
          label: "Hvordan skal dere tilrettelegge arbeidshverdagen fremover?",
          value: "fd",
          fieldId: "tilretteleggingFremover",
          fieldType: "TEXT",
          description: null,
          wasRequired: true,
        },
        {
          label:
            "Har dere andre muligheter for tilrettelegging som ikke prøves ut nå?",
          value: "adsf",
          fieldId: "annenTilrettelegging",
          fieldType: "TEXT",
          description:
            "For eksempel involvering av bedriftshelsetjeneste, eller utføre andre typer arbeidsoppgaver.",
          wasRequired: true,
        },
        {
          label: "Hvordan skal dere følge opp avtalt tilrettelegging?",
          value: "ola",
          fieldId: "hvordanFolgeOpp",
          fieldType: "TEXT",
          description: null,
          wasRequired: true,
        },
        {
          label: "Når skal dere evaluere planen og eventuelt justere den?",
          value: "2025-12-08",
          fieldId: "evalueringsDato",
          fieldType: "DATE",
          description: null,
          wasRequired: true,
        },
        {
          label: "Har den ansatte vært med å lage planen?",
          fieldId: "harDenAnsatteMedvirket",
          options: [
            { optionId: "ja", optionLabel: "Ja" },
            { optionId: "nei", optionLabel: "Nei" },
          ],
          fieldType: "RADIO_GROUP",
          description: null,
          wasRequired: true,
          selectedOptionId: "ja",
        },
      ],
    },
  ],
};
