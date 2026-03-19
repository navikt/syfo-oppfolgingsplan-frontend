import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { mockAkselModal } from "@/test/mocks/akselModalMock";
import {
  mockAnalytics,
  mockLogAnalyticsEvent,
} from "@/test/mocks/analyticsMock";
import { mockRouter } from "@/test/mocks/nextNavigationMock";
import { render } from "@/test/test-utils";
import { LagNyPlanModal } from "../LagNyPlanModal";

const {
  mockSlettUtkastAndRedirectToNyPlanServerAction,
  mockUpsertUtkastWithAktivPlanServerAction,
  mockUseActionState,
  mockUseTransition,
} = vi.hoisted(() => ({
  mockSlettUtkastAndRedirectToNyPlanServerAction: vi.fn(),
  mockUpsertUtkastWithAktivPlanServerAction: vi.fn(),
  mockUseActionState: vi.fn(),
  mockUseTransition: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    startTransition: (callback: () => void) => callback(),
    useActionState: mockUseActionState,
    useTransition: mockUseTransition,
  };
});

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import("@/test/mocks/nextNavigationMock");

  return mockNextNavigation();
});

vi.mock("@/common/analytics/logAnalyticsEvent", () => mockAnalytics());

vi.mock("@/server/actions/slettUtkast", () => ({
  slettUtkastAndRedirectToNyPlanServerAction:
    mockSlettUtkastAndRedirectToNyPlanServerAction,
}));

vi.mock("@/server/actions/upsertUtkastWithAktivPlan", () => ({
  upsertUtkastWithAktivPlanServerAction:
    mockUpsertUtkastWithAktivPlanServerAction,
}));

vi.mock("@navikt/ds-react", () => mockAkselModal());

describe("LagNyPlanModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionState.mockImplementation((_action, initialState) => [
      initialState,
      vi.fn(),
      false,
    ]);
    mockUseTransition.mockImplementation(() => [
      false,
      (callback: () => void) => callback(),
    ]);
  });

  afterEach(() => {
    cleanup();
  });

  test("shows the heading", () => {
    render(<LagNyPlanModal ref={{ current: null }} hasUtkast={false} />);

    expect(
      screen.getByRole("heading", { name: /Lag ny oppfølgingsplan/i }),
    ).toBeInTheDocument();
  });

  test("shows explanatory body text", () => {
    render(<LagNyPlanModal ref={{ current: null }} hasUtkast={false} />);

    expect(
      screen.getByText(
        /Du kan lage en ny oppfølgingsplan med utgangspunkt i den forrige planen du lagde\./i,
      ),
    ).toBeInTheDocument();
  });

  test("shows warning when an existing draft will be replaced", () => {
    render(<LagNyPlanModal ref={{ current: null }} hasUtkast />);

    expect(
      screen.getByText(
        /Du har allerede et påbegynt utkast. Hvis du fortsetter, vil det eksisterende utkastet bli erstattet\./i,
      ),
    ).toBeInTheDocument();
  });

  test("does not show warning when there is no existing draft", () => {
    render(<LagNyPlanModal ref={{ current: null }} hasUtkast={false} />);

    expect(
      screen.queryByText(
        /Du har allerede et påbegynt utkast. Hvis du fortsetter, vil det eksisterende utkastet bli erstattet\./i,
      ),
    ).not.toBeInTheDocument();
  });

  test("navigates to a blank new plan when user starts without draft", async () => {
    const user = userEvent.setup();

    render(<LagNyPlanModal ref={{ current: null }} hasUtkast={false} />);

    await user.click(
      screen.getByRole("button", { name: /Begynn med tom plan/i }),
    );

    expect(mockRouter.push).toHaveBeenCalledWith(
      getAGOpprettNyPlanHref("test-leder-id"),
    );
  });

  test("does not navigate directly when user starts with blank plan and an existing draft", async () => {
    const user = userEvent.setup();

    render(<LagNyPlanModal ref={{ current: null }} hasUtkast />);

    await user.click(
      screen.getByRole("button", { name: /Begynn med tom plan/i }),
    );

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  test("logs cancel analytics when modal is closed", async () => {
    const user = userEvent.setup();

    render(<LagNyPlanModal ref={{ current: null }} hasUtkast={false} />);

    await user.click(screen.getByRole("button", { name: /Lukk modal/i }));

    expect(mockLogAnalyticsEvent).toHaveBeenCalledWith({
      name: "knapp klikket",
      properties: {
        komponentId: "lag-ny-plan-modal-avbryt-knapp",
        tekst: "Avbryt",
        kontekst: "AktivPlanSide-LagNyPlanModal",
      },
    });
  });

  test("does not log cancel analytics when modal close is blocked while an action is pending", async () => {
    const user = userEvent.setup();

    mockUseActionState
      .mockImplementationOnce((_action, initialState) => [
        initialState,
        vi.fn(),
        false,
      ])
      .mockImplementationOnce((_action, initialState) => [
        initialState,
        vi.fn(),
        true,
      ]);

    render(<LagNyPlanModal ref={{ current: null }} hasUtkast />);

    await user.click(screen.getByRole("button", { name: /Lukk modal/i }));

    expect(mockLogAnalyticsEvent).not.toHaveBeenCalled();
  });
});
