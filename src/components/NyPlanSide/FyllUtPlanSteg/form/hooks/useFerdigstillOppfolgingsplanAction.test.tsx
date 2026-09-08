import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  Activity,
  StrictMode,
  Suspense,
  startTransition,
  use,
  useState,
} from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getAGAktivPlanNyligOpprettetHref } from "@/common/route-hrefs";
import { recordAidPlan } from "@/instrumentation/aidPlanTelemetry";
import type { TiltakspakkeContext } from "@/schema/tiltakspakkeContext";
import type { FerdigstillPlanAction } from "@/server/actions/FerdigstillPlanAction";
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
vi.mock("@/instrumentation/aidPlanTelemetry", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/instrumentation/aidPlanTelemetry")
  >()),
  recordAidPlan: vi.fn(),
}));
const action = vi.fn<FerdigstillPlanAction>();
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

  test.each([
    { erITiltaksgruppe: true, evalueringPaaminnelse: true },
    { erITiltaksgruppe: true, evalueringPaaminnelse: false },
    { erITiltaksgruppe: false, evalueringPaaminnelse: true },
    { erITiltaksgruppe: false, evalueringPaaminnelse: false },
  ])("records the submitted preference independently of the variant: %j", async ({
    erITiltaksgruppe,
    evalueringPaaminnelse,
  }) => {
    const submittedPayload = { ...payload, evalueringPaaminnelse };
    const { result } = renderHook(() =>
      useFerdigstillOppfolgingsplanAction(
        { ...context, erITiltaksgruppe },
        action,
      ),
    );

    await act(async () =>
      result.current.startFerdigstillPlanAction(submittedPayload),
    );

    expect(action).toHaveBeenCalledExactlyOnceWith(submittedPayload);
    expect(record.mock.calls.map(([event]) => event)).toEqual(
      ["forsok", "bekreftet"].map((utfall) => ({
        gruppe: "tiltak",
        variant: erITiltaksgruppe ? "aid" : "standard",
        hendelse: "opprett",
        utfall,
        evaluering_paaminnelse: evalueringPaaminnelse ? "ja" : "nei",
      })),
    );
  });

  test("records success only after the response, before navigation, and ignores duplicate submissions", async () => {
    let complete!: (result: FetchUpdateResult) => void;
    action.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { result } = renderHook(() =>
      useFerdigstillOppfolgingsplanAction(context, action),
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
      useFerdigstillOppfolgingsplanAction(context, action),
    );
    await act(async () => result.current.startFerdigstillPlanAction(payload));
    expect(result.current.error).toEqual(error);
    expect(push).not.toHaveBeenCalled();
    expect(record.mock.calls.map(([event]) => event.utfall)).toEqual([
      "forsok",
      "feilet",
    ]);
    await act(async () =>
      result.current.startFerdigstillPlanAction({
        ...payload,
        evalueringPaaminnelse: true,
      }),
    );
    expect(record.mock.calls.map(([event]) => event.utfall)).toEqual([
      "forsok",
      "feilet",
      "forsok",
      "bekreftet",
    ]);
    expect(result.current.error).toBeNull();
    expect(
      record.mock.calls.map(([event]) =>
        event.hendelse === "opprett" ? event.evaluering_paaminnelse : null,
      ),
    ).toEqual(["nei", "nei", "ja", "ja"]);
  });

  test("captures assignment, reminder preference and leader context before awaiting the response", async () => {
    const nextAction = vi
      .fn<FerdigstillPlanAction>()
      .mockResolvedValue({ error: null });
    let complete!: (result: FetchUpdateResult) => void;
    action.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { result, rerender } = renderHook(
      ({
        tiltakspakke,
        save,
      }: {
        tiltakspakke: TiltakspakkeContext;
        save: FerdigstillPlanAction;
      }) => useFerdigstillOppfolgingsplanAction(tiltakspakke, save),
      { initialProps: { tiltakspakke: context, save: action } },
    );
    const submittedPayload = { ...payload, evalueringPaaminnelse: true };
    act(() => result.current.startFerdigstillPlanAction(submittedPayload));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    submittedPayload.evalueringPaaminnelse = false;
    params.narmesteLederId = "leader-b";
    rerender({
      tiltakspakke: { gruppe: "kontroll", erITiltaksgruppe: false },
      save: nextAction,
    });
    await act(async () => complete({ error: null }));
    expect(action).toHaveBeenCalledWith(submittedPayload);
    expect(record).toHaveBeenLastCalledWith({
      gruppe: "tiltak",
      variant: "aid",
      hendelse: "opprett",
      utfall: "bekreftet",
      evaluering_paaminnelse: "ja",
    });
    expect(JSON.stringify(record.mock.calls)).not.toContain("leader-a");
    expect(JSON.stringify(record.mock.calls)).not.toContain("Kontor");
    expect(push).not.toHaveBeenCalled();
    expect(nextAction).not.toHaveBeenCalled();
    await act(async () => result.current.startFerdigstillPlanAction(payload));
    expect(nextAction).toHaveBeenCalledExactlyOnceWith(payload);
    expect(action).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledExactlyOnceWith(
      getAGAktivPlanNyligOpprettetHref("leader-b"),
    );
  });

  test("records a completed save without navigating after the wizard unmounts", async () => {
    let complete!: (result: FetchUpdateResult) => void;
    action.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { result, unmount } = renderHook(() =>
      useFerdigstillOppfolgingsplanAction(context, action),
    );
    act(() => result.current.startFerdigstillPlanAction(payload));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());

    unmount();
    await act(async () => complete({ error: null }));

    expect(record).toHaveBeenLastCalledWith({
      gruppe: "tiltak",
      variant: "aid",
      hendelse: "opprett",
      utfall: "bekreftet",
      evaluering_paaminnelse: "nei",
    });
    expect(push).not.toHaveBeenCalled();
  });

  test("does not resume an old submission's navigation when a cached wizard becomes visible again", async () => {
    let complete!: (result: FetchUpdateResult) => void;
    action.mockReturnValueOnce(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    let visible = true;
    const { result, rerender } = renderHook(
      () => useFerdigstillOppfolgingsplanAction(context, action),
      {
        wrapper: ({ children }) => (
          <StrictMode>
            <Activity mode={visible ? "visible" : "hidden"}>
              {children}
            </Activity>
          </StrictMode>
        ),
      },
    );
    act(() => result.current.startFerdigstillPlanAction(payload));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    visible = false;
    rerender();
    visible = true;
    rerender();

    await act(async () => complete({ error: null }));
    expect(record).toHaveBeenLastCalledWith({
      gruppe: "tiltak",
      variant: "aid",
      hendelse: "opprett",
      utfall: "bekreftet",
      evaluering_paaminnelse: "nei",
    });
    expect(push).not.toHaveBeenCalled();

    // A fresh submission still works after returning; StrictMode does not
    // permanently invalidate this wizard's lifetime.
    await act(async () => result.current.startFerdigstillPlanAction(payload));
    expect(action).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledExactlyOnceWith(
      getAGAktivPlanNyligOpprettetHref("leader-a"),
    );
  });

  test("does not override a newer navigation while its destination is still loading", async () => {
    let completeSave!: (result: FetchUpdateResult) => void;
    action.mockReturnValueOnce(
      new Promise((resolve) => {
        completeSave = resolve;
      }),
    );
    let completeNavigation!: () => void;
    const destinationReady = new Promise<void>((resolve) => {
      completeNavigation = resolve;
    });
    function SlowDestination() {
      use(destinationReady);
      return <p>Other page</p>;
    }
    function Wizard() {
      const { startFerdigstillPlanAction } =
        useFerdigstillOppfolgingsplanAction(context, action);
      return (
        <button
          onClick={() => startFerdigstillPlanAction(payload)}
          type="button"
        >
          Save
        </button>
      );
    }
    function App() {
      const [leftWizard, setLeftWizard] = useState(false);
      return (
        <>
          <button
            onClick={() => startTransition(() => setLeftWizard(true))}
            type="button"
          >
            Leave
          </button>
          <Suspense fallback={<p>Loading</p>}>
            {leftWizard ? <SlowDestination /> : <Wizard />}
          </Suspense>
        </>
      );
    }
    render(<App />);
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByText("Leave"));
    // React keeps the old screen mounted while the new route is loading.
    expect(screen.getByText("Save")).toBeVisible();

    await act(async () => completeSave({ error: null }));
    expect(record).toHaveBeenLastCalledWith({
      gruppe: "tiltak",
      variant: "aid",
      hendelse: "opprett",
      utfall: "bekreftet",
      evaluering_paaminnelse: "nei",
    });
    expect(push).not.toHaveBeenCalled();
    await act(async () => completeNavigation());
    expect(screen.getByText("Other page")).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });
});
