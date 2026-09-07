import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getAGAktivPlanNyligOpprettetHref } from "@/common/route-hrefs";
import { recordAidPlan } from "@/instrumentation/aidPlanTelemetry";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import { ferdigstillPlanServerAction } from "@/server/actions/ferdigstillPlan";
import type { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";
import useFerdigstillOppfolgingsplanAction, {
  type FerdigstillPlanActionPayload,
} from "./useFerdigstillOppfolgingsplanAction";

const { push, params } = vi.hoisted(() => ({
  push: vi.fn(),
  params: { narmesteLederId: "leader-a" },
}));
vi.mock("next/navigation", () => ({
  useParams: () => params,
  useRouter: () => ({ push }),
}));
vi.mock("@/server/actions/ferdigstillPlan", () => ({
  ferdigstillPlanServerAction: vi.fn(),
}));
vi.mock("@/instrumentation/aidPlanTelemetry", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/instrumentation/aidPlanTelemetry")
  >()),
  recordAidPlan: vi.fn(),
}));
const action = vi.mocked(ferdigstillPlanServerAction);
const record = vi.mocked(recordAidPlan);
const context: TiltakspakkeContext = {
  gruppe: "tiltak",
  erITiltaksgruppe: true,
};
const payload: FerdigstillPlanActionPayload = {
  formValues: {
    typiskArbeidshverdag: "Kontor",
    arbeidsoppgaverSomKanUtfores: "Skrive",
    arbeidsoppgaverSomIkkeKanUtfores: "Løfte",
    tidligereTilrettelegging: "",
    tilretteleggingFremover: "Pauser",
    annenTilrettelegging: "",
    hvordanFolgeOpp: "Møter",
    evalueringsDato: "2026-10-15",
    harDenAnsatteMedvirket: "ja",
    denAnsatteHarIkkeMedvirketBegrunnelse: "",
  },
  evalueringsDatoIsoString: "2026-10-15",
  includeIkkeMedvirketBegrunnelseFieldInFormSnapshot: false,
  evalueringPaaminnelse: false,
};

describe("confirmed plan creation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.narmesteLederId = "leader-a";
    action.mockResolvedValue({ error: null });
  });
  afterEach(cleanup);

  test("records success only after the response, before navigation, and ignores duplicate submissions", async () => {
    let complete!: (result: FetchUpdateResult) => void;
    action.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { result } = renderHook(() =>
      useFerdigstillOppfolgingsplanAction(context),
    );
    act(() => {
      result.current.startFerdigstillPlanAction(payload);
      result.current.startFerdigstillPlanAction(payload);
    });
    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    expect(record.mock.calls.map(([event]) => event.utfall)).toEqual([
      "forsok",
    ]);
    expect(push).not.toHaveBeenCalled();
    expect(result.current.isPendingFerdigstillPlan).toBe(true);

    await act(async () => complete({ error: null }));
    expect(record.mock.calls.map(([event]) => event.utfall)).toEqual([
      "forsok",
      "bekreftet",
    ]);
    expect(push).toHaveBeenCalledExactlyOnceWith(
      getAGAktivPlanNyligOpprettetHref("leader-a"),
    );
    expect(record.mock.invocationCallOrder[1]).toBeLessThan(
      push.mock.invocationCallOrder[0],
    );
    act(() => result.current.startFerdigstillPlanAction(payload));
    expect(action).toHaveBeenCalledTimes(1);
  });

  test("keeps errors visible, does not navigate and permits a real retry", async () => {
    const error = { type: "FETCH_NETWORK_ERROR" } as const;
    action.mockResolvedValueOnce({ error });
    const { result } = renderHook(() =>
      useFerdigstillOppfolgingsplanAction(context),
    );
    await act(async () => result.current.startFerdigstillPlanAction(payload));
    expect(result.current.error).toEqual(error);
    expect(push).not.toHaveBeenCalled();
    expect(record.mock.calls.map(([event]) => event.utfall)).toEqual([
      "forsok",
      "feilet",
    ]);
    await act(async () => result.current.startFerdigstillPlanAction(payload));
    expect(record.mock.calls.map(([event]) => event.utfall)).toEqual([
      "forsok",
      "feilet",
      "forsok",
      "bekreftet",
    ]);
    expect(result.current.error).toBeNull();
  });

  test("captures assignment and leader context before awaiting the response", async () => {
    let complete!: (result: FetchUpdateResult) => void;
    action.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { result, rerender } = renderHook(
      (tiltakspakke: TiltakspakkeContext) =>
        useFerdigstillOppfolgingsplanAction(tiltakspakke),
      { initialProps: context },
    );
    act(() => result.current.startFerdigstillPlanAction(payload));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    params.narmesteLederId = "leader-b";
    rerender({ gruppe: "kontroll", erITiltaksgruppe: false });
    await act(async () => complete({ error: null }));
    expect(action).toHaveBeenCalledWith("leader-a", payload);
    expect(record).toHaveBeenLastCalledWith({
      gruppe: "tiltak",
      variant: "aid",
      hendelse: "opprett",
      utfall: "bekreftet",
    });
    expect(JSON.stringify(record.mock.calls)).not.toContain("leader-a");
    expect(JSON.stringify(record.mock.calls)).not.toContain("Kontor");
  });
});
