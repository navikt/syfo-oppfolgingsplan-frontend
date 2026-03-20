import { expect, test } from "vitest";
import { lumiSurveySM } from "./lumiSurveySM";

test("uses the medvirkning survey configuration for sykmeldt", () => {
  expect(lumiSurveySM.type).toBe("custom");
  expect(lumiSurveySM.questions).toHaveLength(4);

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
        { value: "sammen", label: "Ja, vi satt sammen og lagde den" },
        {
          value: "snakket",
          label: "Ja, vi snakket sammen, og lederen min lagde den etterpå",
        },
        {
          value: "uten-meg",
          label: "Nei, lederen min lagde den uten at vi snakket sammen",
        },
        { value: "annet", label: "Annet" },
      ],
    }),
    expect.objectContaining({
      id: "deling-holdning",
      type: "singleChoice",
      required: true,
      options: [
        { value: "helt-greit", label: "Helt greit" },
        { value: "greit", label: "Greit" },
        { value: "ikke-greit", label: "Ikke greit" },
      ],
    }),
    expect.objectContaining({
      id: "annet",
      type: "text",
      required: false,
    }),
  ]);
});
