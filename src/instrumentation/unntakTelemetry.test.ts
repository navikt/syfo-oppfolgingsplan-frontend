import { beforeEach, expect, test, vi } from "vitest";
import { recordUnntak } from "./unntakTelemetry";

const { pushEvent, getBrowserObservability } = vi.hoisted(() => ({
  pushEvent: vi.fn(),
  getBrowserObservability: vi.fn(),
}));
vi.mock("./browser", () => ({ getBrowserObservability }));

beforeEach(() => {
  vi.clearAllMocks();
  getBrowserObservability.mockReturnValue({ api: { pushEvent } });
});

test("records unntak events without group or package dimensions", () => {
  recordUnntak({ hendelse: "aapnet" });

  expect(pushEvent).toHaveBeenCalledWith(
    "unntaksvurdering",
    {
      hendelse: "aapnet",
      flate: "oversikt_arbeidsgiver",
      schema_version: "2",
    },
    "oppfolgingsplan",
    { skipDedupe: true },
  );
});
