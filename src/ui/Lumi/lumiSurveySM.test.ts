import { expect, test } from "vitest";
import { lumiSurveySM } from "./lumiSurveySM";

test("uses the nytteverdi survey configuration for sykmeldt", () => {
  expect(lumiSurveySM.type).toBe("rating");
  expect(lumiSurveySM.questions).toHaveLength(4);

  expect(lumiSurveySM.questions).toEqual([
    expect.objectContaining({
      id: "nytteverdi",
      type: "rating",
      variant: "emoji",
      required: true,
    }),
    expect.objectContaining({
      id: "nytteverdi-utdypning",
      type: "text",
      required: false,
    }),
    expect.objectContaining({
      id: "gjenkjennelse",
      type: "singleChoice",
      required: true,
      options: [
        { value: "ja", label: "Ja" },
        { value: "nei", label: "Nei" },
      ],
    }),
    expect.objectContaining({
      id: "gjenkjennelse-utdypning",
      type: "text",
      required: false,
      visibleIf: { questionId: "gjenkjennelse", operator: "EQ", value: "nei" },
    }),
  ]);
});
