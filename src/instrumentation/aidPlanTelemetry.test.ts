import { beforeEach, describe, expect, test, vi } from "vitest";
import { getAidPlanAttributes, recordAidPlan } from "./aidPlanTelemetry";

const { pushEvent, getBrowserObservability } = vi.hoisted(() => ({
  pushEvent: vi.fn(),
  getBrowserObservability: vi.fn(),
}));
vi.mock("./browser", () => ({ getBrowserObservability }));

describe("AID plan event boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getBrowserObservability.mockReturnValue({ api: { pushEvent } });
  });
  const event = {
    gruppe: "tiltak",
    skjemavariant: "tiltak",
    hendelse: "opprett",
    utfall: "bekreftet",
  } as const;

  test("strips extra fields and reuses APM without cross-visit dedupe", () => {
    const withExtraFields = {
      ...event,
      orgnummer: "123456789",
      fnr: "12345678901",
      content: "sensitive",
      planId: "plan",
    };
    recordAidPlan(withExtraFields);
    recordAidPlan(event);
    expect(pushEvent).toHaveBeenCalledTimes(2);
    expect(pushEvent).toHaveBeenCalledWith(
      "aid_oppfolgingsplan",
      {
        ...event,
        tiltakspakke: "OPPFOLGINGSPLAN_TILTAKSPAKKE_1",
        flate: "ny_plan",
        schema_version: "1",
      },
      "aid",
      { skipDedupe: true },
    );
  });

  test("rejects invalid categories and event/outcome combinations", () => {
    // @ts-expect-error Single-organisation context has no mixed category.
    recordAidPlan({ ...event, gruppe: "blandet" });
    // @ts-expect-error A view does not confirm plan creation.
    recordAidPlan({ ...event, hendelse: "vist" });
    // @ts-expect-error Free text is not an outcome.
    recordAidPlan({ ...event, utfall: "sensitive" });
    expect(pushEvent).not.toHaveBeenCalled();
  });

  test("separates assignment from delivered skjemavariant", () => {
    expect(
      getAidPlanAttributes({ gruppe: "tiltak", erITiltaksgruppe: false }),
    ).toEqual({
      gruppe: "tiltak",
      skjemavariant: "standard",
    });
  });

  test("does not interrupt the product when APM is missing or throws", () => {
    getBrowserObservability.mockReturnValue(undefined);
    expect(() => recordAidPlan(event)).not.toThrow();
    getBrowserObservability.mockReturnValue({ api: { pushEvent } });
    pushEvent.mockImplementationOnce(() => {
      throw new Error("unavailable");
    });
    expect(() => recordAidPlan(event)).not.toThrow();
  });
});
