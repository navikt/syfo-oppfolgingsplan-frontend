import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Activity, StrictMode } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { logAnalyticsEvent } from "@/common/analytics/logAnalyticsEvent";
import { recordAidUnntak } from "@/instrumentation/aidUnntakTelemetry";
import { FrontendErrorType } from "@/server/actions/FrontendErrorTypeEnum";
import { meldUnntaksvurderingServerAction } from "@/server/actions/meldUnntaksvurdering";
import { render } from "@/test/test-utils";
import NyPlanOgUnntak from "../NyPlanOgUnntak";

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );
  return mockNextNavigation();
});
vi.mock("@/instrumentation/aidUnntakTelemetry", () => ({
  recordAidUnntak: vi.fn(),
}));
vi.mock("@/common/analytics/logAnalyticsEvent", () => ({
  logAnalyticsEvent: vi.fn(),
}));
vi.mock("@/server/actions/meldUnntaksvurdering", () => ({
  meldUnntaksvurderingServerAction: vi.fn(),
}));

const flow = (id = "test-leder-id") => (
  <NyPlanOgUnntak key={id} narmesteLederId={id} ansattNavn="Kreativ Hatt" />
);
const events = () =>
  vi.mocked(recordAidUnntak).mock.calls.map(([event]) => event.hendelse);
const openButton = () => screen.getByRole("button", { name: /Vis mer/i });
const planButton = () =>
  screen.getByRole("button", { name: /Lag en ny oppfølgingsplan/i });
const sendButton = () =>
  screen.getByRole("button", { name: /Send til Nav og den ansatte/i });

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(meldUnntaksvurderingServerAction).mockResolvedValue({
    error: null,
  });
});
afterEach(cleanup);

test("only counts plan clicks after opening, including after closing; keeps existing analytics", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<StrictMode>{flow()}</StrictMode>);
  await user.click(planButton());
  expect(events()).toEqual([]);
  expect(logAnalyticsEvent).toHaveBeenCalledTimes(1);
  await user.click(openButton());
  await user.click(screen.getByRole("button", { expanded: true }));
  rerender(<StrictMode>{flow()}</StrictMode>);
  await user.click(openButton());
  await user.click(screen.getByRole("button", { expanded: true }));
  await user.click(planButton());
  expect(events()).toEqual(["aapnet", "lag_plan"]);
  expect(logAnalyticsEvent).toHaveBeenCalledTimes(2);
});

test("keyboard opening and submit count intent before validation, with each retry counted", async () => {
  const user = userEvent.setup();
  render(flow());
  openButton().focus();
  await user.keyboard("{Enter}");
  sendButton().focus();
  await user.keyboard("{Enter}");
  expect(events()).toEqual(["aapnet", "send"]);
  expect(meldUnntaksvurderingServerAction).not.toHaveBeenCalled();
  expect(
    screen.getByText(/Du må rette dette før du kan sende/i),
  ).toBeInTheDocument();
  await user.click(sendButton());
  expect(events()).toEqual(["aapnet", "send", "send"]);
});

test("API failure and success add no extra observations; receipt dismissal preserves the visit", async () => {
  const user = userEvent.setup();
  vi.mocked(meldUnntaksvurderingServerAction).mockResolvedValueOnce({
    error: { type: FrontendErrorType.FETCH_NETWORK_ERROR },
  });
  const { rerender } = render(flow());
  await user.click(openButton());
  await user.click(screen.getByRole("checkbox", { name: /bekrefter/i }));
  await user.click(sendButton());
  await screen.findByText(/Vi fikk ikke kontakt med tjenesten/i);
  await user.click(sendButton());
  await screen.findByText(/Meldingen er sendt til Nav og den ansatte/i);
  rerender(flow());
  await user.click(screen.getByRole("button", { name: /lukk/i }));
  await user.click(openButton());
  await user.click(planButton());
  expect(events()).toEqual(["aapnet", "send", "send", "lag_plan"]);
});

test("a different leader and a fresh mount cannot inherit an opening", async () => {
  const user = userEvent.setup();
  const { rerender, unmount } = render(flow());
  await user.click(openButton());
  rerender(flow("another-leader"));
  await user.click(planButton());
  expect(events()).toEqual(["aapnet"]);
  await user.click(openButton());
  expect(events()).toEqual(["aapnet", "aapnet"]);
  unmount();
  render(flow());
  await user.click(planButton());
  expect(events()).toEqual(["aapnet", "aapnet"]);
});

test("returning from a hidden Activity requires a new explicit opening", async () => {
  const user = userEvent.setup();
  const page = (mode: "visible" | "hidden") => (
    <Activity mode={mode}>{flow()}</Activity>
  );
  const { rerender } = render(page("visible"));
  await user.click(openButton());
  rerender(page("hidden"));
  rerender(page("visible"));
  await user.click(planButton());
  await user.click(sendButton());
  expect(events()).toEqual(["aapnet"]);
  // React keeps the card open, but it was opened in the previous visit.
  await user.click(screen.getByRole("button", { expanded: true }));
  await user.click(openButton());
  await user.click(planButton());
  expect(events()).toEqual(["aapnet", "aapnet", "lag_plan"]);
});
