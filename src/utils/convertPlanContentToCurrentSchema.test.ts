import { expect, test } from "vitest";
import {
  OppfolgingsplanFormUnderArbeid,
  OppfolgingsplanFormUtfyllt,
} from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import {
  PlanContent,
  convertPlanContentToCurrentSchema,
} from "./convertPlanContentToCurrentSchema";

test("Returns the same object when plan content matches current plan schema with all properties", () => {
  const fullPlanContent: PlanContent = {
    typiskArbeidshverdag: "Tekst om arbeidshverdag",
    arbeidsoppgaverSomKanUtfores: "Kan utføres",
    arbeidsoppgaverSomIkkeKanUtfores: "Kan ikke utføres",
    tidligereTilrettelegging: "Tidligere tilrettelegging",
    tilretteleggingFremover: "Tilrettelegging fremover",
    annenTilrettelegging: "Annen tilrettelegging",
    hvordanFolgeOpp: "Slik følger vi opp",
    evalueringsDato: "2025-01-01",
    harDenAnsatteMedvirket: "ja",
    denAnsatteHarIkkeMedvirketBegrunnelse: "Begrunnelse",
  } satisfies OppfolgingsplanFormUtfyllt;

  const result = convertPlanContentToCurrentSchema(fullPlanContent);

  expect(result).toEqual(fullPlanContent);
});

test("Returns the same object when plan content matches current plan schema, with some optional properties missing", () => {
  // When plan content comes from stored utkast, it may not include all properties.
  const partialPlanContent: PlanContent = {
    typiskArbeidshverdag: "Tekst om arbeidshverdag",
    arbeidsoppgaverSomKanUtfores: "Kan utføres",
    tidligereTilrettelegging: "Tidligere tilrettelegging",
    tilretteleggingFremover: "Tilrettelegging fremover",
    hvordanFolgeOpp: "Slik følger vi opp",
    evalueringsDato: "2025-01-01",
  } satisfies OppfolgingsplanFormUnderArbeid;

  const result = convertPlanContentToCurrentSchema(partialPlanContent);

  expect(result).toEqual(partialPlanContent);
});

test("Plan content with only one property from current schema should work the same", () => {
  // All properties are optional in OppfolgingsplanFormAndUtkastSchema
  const planContentWithOnlyOneProperty: PlanContent = {
    typiskArbeidshverdag: "Tekst om arbeidshverdag",
  } satisfies OppfolgingsplanFormUnderArbeid;

  const result = convertPlanContentToCurrentSchema(
    planContentWithOnlyOneProperty,
  );

  expect(result).toEqual({
    typiskArbeidshverdag: planContentWithOnlyOneProperty.typiskArbeidshverdag,
  });
});

// Extra keys in stored content that are not part of the current schema
// should be ignored.
test("Properties in planContent not found in current plan schema should not be included in result", () => {
  const planContentWithBothKnownAndUnknownProperties: PlanContent = {
    typiskArbeidshverdag: "Tekst om arbeidshverdag",
    arbeidsoppgaverSomKanUtfores: "Kan utføres",
    hvordanFolgeOpp: "Slik følger vi opp",
    unknownField: "skal ignoreres",
  };

  const result = convertPlanContentToCurrentSchema(
    planContentWithBothKnownAndUnknownProperties,
  );

  expect(result).toEqual({
    typiskArbeidshverdag:
      planContentWithBothKnownAndUnknownProperties.typiskArbeidshverdag,
    arbeidsoppgaverSomKanUtfores:
      planContentWithBothKnownAndUnknownProperties.arbeidsoppgaverSomKanUtfores,
    hvordanFolgeOpp:
      planContentWithBothKnownAndUnknownProperties.hvordanFolgeOpp,
  });
});

test("It should return an emtpy object if called with planContent with no properties found in current plan schema", () => {
  const planContentWithNoKnownProperties: PlanContent = {
    unknownField1: "noe",
    unknownField2: true,
    unknownField3: null,
  };

  const result = convertPlanContentToCurrentSchema(
    planContentWithNoKnownProperties,
  );

  expect(result).toEqual({});
});
