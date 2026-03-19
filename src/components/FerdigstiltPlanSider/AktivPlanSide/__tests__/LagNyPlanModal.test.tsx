import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { render } from "@/test/test-utils";
import { LagNyPlanModal } from "../LagNyPlanModal";

const { mockPush, mockLogAnalyticsEvent } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockLogAnalyticsEvent: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ narmesteLederId: "test-leder-id" }),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/common/analytics/logAnalyticsEvent", () => ({
  logAnalyticsEvent: mockLogAnalyticsEvent,
}));

vi.mock("@navikt/ds-react", async () => {
  const actual =
    await vi.importActual<typeof import("@navikt/ds-react")>(
      "@navikt/ds-react",
    );

  const Modal = Object.assign(
    ({
      children,
      header,
      onClose,
    }: {
      children: React.ReactNode;
      header?: { heading?: string };
      onClose?: React.ReactEventHandler<HTMLDialogElement>;
    }) => (
      <div>
        {header?.heading ? <h2>{header.heading}</h2> : null}
        <button
          type="button"
          aria-label="Lukk modal"
          onClick={() =>
            onClose?.({} as React.SyntheticEvent<HTMLDialogElement>)
          }
        >
          Lukk
        </button>
        {children}
      </div>
    ),
    {
      Body: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Footer: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
    },
  );

  return {
    ...actual,
    Modal,
  };
});

describe("LagNyPlanModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(mockPush).toHaveBeenCalledWith(
      getAGOpprettNyPlanHref("test-leder-id"),
    );
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
});
