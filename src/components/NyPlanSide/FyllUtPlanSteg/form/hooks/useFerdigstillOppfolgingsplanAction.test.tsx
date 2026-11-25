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
const action = vi.fn<FerdigstillPlanAction>();
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

function SlowDestination({
  destinationReady,
}: {
  destinationReady: Promise<void>;
}) {
  use(destinationReady);
  return <p>Other page</p>;
}

function SaveWizard() {
  const { startFerdigstillPlanAction } =
    useFerdigstillOppfolgingsplanAction(action);
  return (
    <button onClick={() => startFerdigstillPlanAction(payload)} type="button">
      Save
    </button>
  );
}

function LeaveWizardApp({
  destinationReady,
}: {
  destinationReady: Promise<void>;
}) {
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
        {leftWizard ? (
          <SlowDestination destinationReady={destinationReady} />
        ) : (
          <SaveWizard />
        )}
      </Suspense>
    </>
  );
}

describe("confirmed plan creation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.narmesteLederId = "leader-a";
    action.mockResolvedValue({ error: null });
  });
  afterEach(cleanup);

  test("navigates only after the response and ignores duplicate submissions", async () => {
    let complete!: (result: FetchUpdateResult) => void;
    action.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { result } = renderHook(() =>
      useFerdigstillOppfolgingsplanAction(action),
    );
    act(() => {
      result.current.startFerdigstillPlanAction(payload);
      result.current.startFerdigstillPlanAction(payload);
    });
    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    expect(push).not.toHaveBeenCalled();
    expect(result.current.isPendingFerdigstillPlan).toBe(true);

    await act(async () => complete({ error: null }));
    expect(push).toHaveBeenCalledExactlyOnceWith(
      getAGAktivPlanNyligOpprettetHref("leader-a"),
    );
    act(() => result.current.startFerdigstillPlanAction(payload));
    expect(action).toHaveBeenCalledTimes(1);
  });

  test("keeps errors visible, does not navigate and permits a real retry", async () => {
    const error = { type: "FETCH_NETWORK_ERROR" } as const;
    action.mockResolvedValueOnce({ error });
    const { result } = renderHook(() =>
      useFerdigstillOppfolgingsplanAction(action),
    );
    await act(async () => result.current.startFerdigstillPlanAction(payload));
    expect(result.current.error).toEqual(error);
    expect(push).not.toHaveBeenCalled();
    await act(async () => result.current.startFerdigstillPlanAction(payload));
    expect(action).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeNull();
    expect(push).toHaveBeenCalledExactlyOnceWith(
      getAGAktivPlanNyligOpprettetHref("leader-a"),
    );
  });

  test("captures the payload and leader context before awaiting the response", async () => {
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
      ({ save }: { save: FerdigstillPlanAction }) =>
        useFerdigstillOppfolgingsplanAction(save),
      { initialProps: { save: action } },
    );
    const submittedPayload = { ...payload, evalueringPaaminnelse: true };
    act(() => result.current.startFerdigstillPlanAction(submittedPayload));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    submittedPayload.evalueringPaaminnelse = false;
    params.narmesteLederId = "leader-b";
    rerender({ save: nextAction });
    await act(async () => complete({ error: null }));
    expect(action).toHaveBeenCalledWith(submittedPayload);
    expect(push).not.toHaveBeenCalled();
    expect(nextAction).not.toHaveBeenCalled();
    await act(async () => result.current.startFerdigstillPlanAction(payload));
    expect(nextAction).toHaveBeenCalledExactlyOnceWith(payload);
    expect(action).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledExactlyOnceWith(
      getAGAktivPlanNyligOpprettetHref("leader-b"),
    );
  });

  test("does not navigate when a save completes after the wizard unmounts", async () => {
    let complete!: (result: FetchUpdateResult) => void;
    action.mockReturnValue(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { result, unmount } = renderHook(() =>
      useFerdigstillOppfolgingsplanAction(action),
    );
    act(() => result.current.startFerdigstillPlanAction(payload));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());

    unmount();
    await act(async () => complete({ error: null }));

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
      () => useFerdigstillOppfolgingsplanAction(action),
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
    render(<LeaveWizardApp destinationReady={destinationReady} />);
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(action).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByText("Leave"));
    // React keeps the old screen mounted while the new route is loading.
    expect(screen.getByText("Save")).toBeVisible();

    await act(async () => completeSave({ error: null }));
    expect(push).not.toHaveBeenCalled();
    await act(async () => completeNavigation());
    expect(screen.getByText("Other page")).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });
});
