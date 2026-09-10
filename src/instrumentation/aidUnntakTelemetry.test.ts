import { beforeEach, expect, test, vi } from "vitest";
import { recordAidUnntak } from "./aidUnntakTelemetry";

const { pushEvent, getBrowserObservability } = vi.hoisted(() => ({
  pushEvent: vi.fn(),
  getBrowserObservability: vi.fn(),
}));
vi.mock("./browser", () => ({ getBrowserObservability }));

beforeEach(() => {
  vi.clearAllMocks();
  getBrowserObservability.mockReturnValue({ api: { pushEvent } });
});

test.each([
  "aapnet",
  "send",
  "lag_plan",
] as const)("emits only the closed contract for %s and preserves repeated actions", (hendelse) => {
  const event = {
    hendelse,
    ansattNavn: "synthetic",
    narmesteLederId: "test-id",
  };
  recordAidUnntak(event);
  recordAidUnntak(event);
  expect(pushEvent).toHaveBeenCalledTimes(2);
  expect(pushEvent).toHaveBeenCalledWith(
    "aid_unntaksvurdering",
    {
      hendelse,
      gruppe: "tiltak",
      tiltakspakke: "OPPFOLGINGSPLAN_TILTAKSPAKKE_1",
      flate: "oversikt_arbeidsgiver",
      schema_version: "1",
    },
    "aid",
    { skipDedupe: true },
  );
});

test("rejects unsupported observations", () => {
  // @ts-expect-error This contract measures behaviour, not API results.
  recordAidUnntak({ hendelse: "bekreftet" });
  // @ts-expect-error Missing event is invalid at the runtime boundary too.
  recordAidUnntak({});
  expect(pushEvent).not.toHaveBeenCalled();
});

test("missing or failing telemetry does not interrupt the action", () => {
  getBrowserObservability.mockReturnValue(undefined);
  expect(() => recordAidUnntak({ hendelse: "send" })).not.toThrow();
  getBrowserObservability.mockReturnValue({ api: { pushEvent } });
  pushEvent.mockImplementationOnce(() => {
    throw new Error("unavailable");
  });
  expect(() => recordAidUnntak({ hendelse: "send" })).not.toThrow();
});
