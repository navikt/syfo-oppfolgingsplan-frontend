import { act, cleanup, render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { recordAidPlan } from "@/instrumentation/aidPlanTelemetry";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import { usePlanDeliveryTelemetry } from "./usePlanDeliveryTelemetry";

vi.mock("@/instrumentation/aidPlanTelemetry", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/instrumentation/aidPlanTelemetry")
  >()),
  recordAidPlan: vi.fn(),
}));
const record = vi.mocked(recordAidPlan);
const observers: Array<{
  callback: IntersectionObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
}> = [];

function Form({ context }: { context: TiltakspakkeContext }) {
  const ref = usePlanDeliveryTelemetry(context);
  return <section ref={ref}>Skjema</section>;
}
function intersect(index = observers.length - 1) {
  act(() =>
    observers[index].callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );
}

describe("plan delivery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    observers.length = 0;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        disconnect = vi.fn();
        observe = vi.fn();
        constructor(callback: IntersectionObserverCallback) {
          observers.push({ callback, disconnect: this.disconnect });
        }
      },
    );
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  test.each([
    ["tiltak", true, "aid"],
    ["tiltak", false, "standard"],
    ["kontroll", false, "standard"],
    ["utenfor_scope", false, "standard"],
    ["ukjent", false, "standard"],
  ] as const)("records %s independently of delivered %s", (gruppe, erITiltaksgruppe, variant) => {
    const context = { gruppe, erITiltaksgruppe };
    const tree = (
      <StrictMode>
        <Form context={context} />
      </StrictMode>
    );
    const { rerender } = render(tree);
    expect(record).toHaveBeenCalledExactlyOnceWith({
      gruppe,
      variant,
      hendelse: "beslutning",
      utfall: "tilgjengelig",
    });
    intersect();
    intersect();
    rerender(tree);
    expect(record).toHaveBeenCalledTimes(2);
    expect(record).toHaveBeenLastCalledWith({
      gruppe,
      variant,
      hendelse: "vist",
      utfall: "tilgjengelig",
    });
  });

  test("ignores old observer callbacks after a context is unmounted", () => {
    const { rerender } = render(
      <Form key="a" context={{ gruppe: "tiltak", erITiltaksgruppe: true }} />,
    );
    rerender(
      <Form
        key="b"
        context={{ gruppe: "kontroll", erITiltaksgruppe: false }}
      />,
    );
    intersect(0);
    expect(
      record.mock.calls.filter(([event]) => event.hendelse === "vist"),
    ).toHaveLength(0);
    intersect();
    expect(record).toHaveBeenLastCalledWith({
      gruppe: "kontroll",
      variant: "standard",
      hendelse: "vist",
      utfall: "tilgjengelig",
    });
  });

  test("does not invent viewport evidence without IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Form context={{ gruppe: "tiltak", erITiltaksgruppe: true }} />);
    expect(record.mock.calls.map(([event]) => event.hendelse)).toEqual([
      "beslutning",
    ]);
  });
});
