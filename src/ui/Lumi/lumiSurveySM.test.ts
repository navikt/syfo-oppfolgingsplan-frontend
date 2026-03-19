import { expect, test } from "vitest";
import { lumiSurveySM } from "./lumiSurveySM";

test("uses the medvirkning survey configuration for sykmeldt", () => {
  expect(lumiSurveySM.type).toBe("custom");
  expect(lumiSurveySM.questions).toHaveLength(10);

  expect(lumiSurveySM.questions).toEqual([
    expect.objectContaining({
      id: "opplevelse",
      type: "rating",
      variant: "emoji",
      required: true,
    }),
    expect.objectContaining({
      id: "samarbeid",
      type: "singleChoice",
      required: true,
      options: [
        { value: "sammen", label: "Vi satt sammen og lagde den" },
        {
          value: "snakket",
          label: "Vi snakket sammen, og lederen skrev den etterpå",
        },
        {
          value: "uten-meg",
          label: "Lederen lagde den uten at vi snakket om den",
        },
        { value: "annet", label: "Annet" },
      ],
      visibleIf: {
        field: "ANSWER",
        questionId: "opplevelse",
        operator: "EXISTS",
      },
    }),
    expect.objectContaining({
      id: "samarbeid-annet",
      type: "text",
      required: false,
      visibleIf: {
        field: "ANSWER",
        questionId: "samarbeid",
        operator: "EQ",
        value: "annet",
      },
    }),
    expect.objectContaining({
      id: "behov",
      type: "rating",
      variant: "emoji",
      required: true,
      visibleIf: {
        field: "ANSWER",
        questionId: "samarbeid",
        operator: "EXISTS",
      },
    }),
    expect.objectContaining({
      id: "hva-savner-du",
      type: "text",
      required: false,
      visibleIf: {
        field: "ANSWER",
        questionId: "behov",
        operator: "LT",
        value: 4,
      },
    }),
    expect.objectContaining({
      id: "hva-fungerer",
      type: "text",
      required: false,
      visibleIf: {
        field: "ANSWER",
        questionId: "behov",
        operator: "GT",
        value: 3,
      },
    }),
    expect.objectContaining({
      id: "deling-kunnskap",
      type: "singleChoice",
      required: true,
      visibleIf: {
        field: "ANSWER",
        questionId: "behov",
        operator: "EXISTS",
      },
    }),
    expect.objectContaining({
      id: "deling-holdning",
      type: "singleChoice",
      required: true,
      visibleIf: {
        field: "ANSWER",
        questionId: "deling-kunnskap",
        operator: "EXISTS",
      },
    }),
    expect.objectContaining({
      id: "forbedring",
      type: "singleChoice",
      required: false,
      visibleIf: {
        field: "ANSWER",
        questionId: "deling-holdning",
        operator: "EXISTS",
      },
    }),
    expect.objectContaining({
      id: "annet",
      type: "text",
      required: false,
      visibleIf: {
        field: "ANSWER",
        questionId: "deling-holdning",
        operator: "EXISTS",
      },
    }),
  ]);
});
