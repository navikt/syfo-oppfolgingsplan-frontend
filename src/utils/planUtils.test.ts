import { describe, expect, it } from "vitest";
import type { FormSnapshot } from "@/utils/FormSnapshot/schemas/FormSnapshot";
import { hasMedvirket } from "./planUtils";

function makeSnapshot(selectedOptionId: string | null): FormSnapshot {
  return {
    formIdentifier: "oppfolgingsplan",
    formSemanticVersion: "1.0.0",
    formSnapshotVersion: "1.0.0",
    sections: [
      {
        sectionId: "section-1",
        sectionTitle: "Om planen",
        fields: [
          {
            fieldId: "harDenAnsatteMedvirket",
            fieldType: "RADIO_GROUP",
            label: "Har du snakket med den ansatte om innholdet i planen?",
            description: null,
            wasRequired: true,
            options: [
              { optionId: "ja", optionLabel: "Ja" },
              { optionId: "nei", optionLabel: "Nei" },
            ],
            selectedOptionId,
          },
        ],
      },
    ],
  };
}

describe("hasMedvirket", () => {
  it('returns true when harDenAnsatteMedvirket is "ja"', () => {
    expect(hasMedvirket(makeSnapshot("ja"))).toBe(true);
  });

  it('returns false when harDenAnsatteMedvirket is "nei"', () => {
    expect(hasMedvirket(makeSnapshot("nei"))).toBe(false);
  });

  it("returns false when harDenAnsatteMedvirket is null", () => {
    expect(hasMedvirket(makeSnapshot(null))).toBe(false);
  });

  it("returns false when harDenAnsatteMedvirket field is missing", () => {
    const snapshot: FormSnapshot = {
      formIdentifier: "oppfolgingsplan",
      formSemanticVersion: "1.0.0",
      formSnapshotVersion: "1.0.0",
      sections: [
        {
          sectionId: "section-1",
          sectionTitle: "Om planen",
          fields: [],
        },
      ],
    };
    expect(hasMedvirket(snapshot)).toBe(false);
  });
});
