import { formLabels } from "@/components/NyPlanSide/form-labels";
import { FormSnapshotFormShape } from "../FormSnapshot/schemas/FormShape";

const OPPFOLGINGSPLAN_FORM_IDENTIFIER = "oppfolgingsplan-navno";
const OPPFOLGINGSPLAN_FORM_VERSION = "1.0.0";
const FORM_SNAPSHOT_VERSION = "2.0.0";

export function getOppfolgingsplanFormShape(
  includeIkkeMedvirketField: boolean,
): FormSnapshotFormShape {
  return {
    formIdentifier: OPPFOLGINGSPLAN_FORM_IDENTIFIER,
    formSemanticVersion: OPPFOLGINGSPLAN_FORM_VERSION,
    formSnapshotVersion: FORM_SNAPSHOT_VERSION,
    sections: [
      {
        sectionId: "arbeidsoppgaver",
        sectionTitle: "Arbeidsoppgaver",
        fields: [
          {
            fieldId: "typiskArbeidshverdag",
            fieldType: "TEXT",
            label: formLabels.typiskArbeidshverdag.label,
            description: formLabels.typiskArbeidshverdag.description,
            wasRequired: true,
          },
          {
            fieldId: "arbeidsoppgaverSomKanUtfores",
            fieldType: "TEXT",
            label: formLabels.arbeidsoppgaverSomKanUtfores.label,
            description: null,
            wasRequired: true,
          },
          {
            fieldId: "arbeidsoppgaverSomIkkeKanUtfores",
            fieldType: "TEXT",
            label: formLabels.arbeidsoppgaverSomIkkeKanUtfores.label,
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
            fieldId: "tidligereTilrettelegging",
            fieldType: "TEXT",
            label: formLabels.tidligereTilrettelegging.label,
            description: formLabels.tidligereTilrettelegging.description,
            wasRequired: true,
          },
          {
            fieldId: "tilretteleggingFremover",
            fieldType: "TEXT",
            label: formLabels.tilretteleggingFremover.label,
            description: null,
            wasRequired: true,
          },
          {
            fieldId: "annenTilrettelegging",
            fieldType: "TEXT",
            label: formLabels.annenTilrettelegging.label,
            description: formLabels.annenTilrettelegging.description,
            wasRequired: true,
          },
          {
            fieldId: "hvordanFolgeOpp",
            fieldType: "TEXT",
            label: formLabels.hvordanFolgeOpp.label,
            description: null,
            wasRequired: true,
          },
          {
            fieldId: "evalueringsDato",
            fieldType: "DATE",
            label: formLabels.evalueringsDato.label,
            description: null,
            wasRequired: true,
          },
          {
            fieldId: "harDenAnsatteMedvirket",
            fieldType: "RADIO_GROUP",
            label: formLabels.harDenAnsatteMedvirket.label,
            description: null,
            wasRequired: true,
            options: [
              { optionId: "ja", optionLabel: "Ja" },
              { optionId: "nei", optionLabel: "Nei" },
            ],
          },
          ...(includeIkkeMedvirketField
            ? [
                {
                  fieldId: "denAnsatteHarIkkeMedvirketBegrunnelse",
                  fieldType: "TEXT",
                  label: formLabels.denAnsatteHarIkkeMedvirketBegrunnelse.label,
                  description:
                    formLabels.denAnsatteHarIkkeMedvirketBegrunnelse
                      .description,
                  wasRequired: true,
                } as const,
              ]
            : []),
        ],
      },
    ],
  };
}
