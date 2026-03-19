import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "@/test/test-utils";
import { AktivPlanButtons } from "../AktivPlanButtons";

const { mockPush } = vi.hoisted(() => ({
  mockPush: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ narmesteLederId: "test-leder-id" }),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/common/analytics/logAnalyticsEvent", () => ({
  logAnalyticsEvent: vi.fn(),
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

vi.mock("../VisPdfButtonAG", () => ({
  VisPdfButtonAG: () => <button type="button">Vis PDF</button>,
}));

describe("AktivPlanButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders the primary button for creating a new plan", () => {
    render(<AktivPlanButtons planId="plan-123" hasUtkast={false} />);

    expect(
      screen.getByRole("button", { name: /Lag ny oppfølgingsplan/i }),
    ).toBeInTheDocument();
  });

  test("does not render the old action buttons", () => {
    render(<AktivPlanButtons planId="plan-123" hasUtkast={false} />);

    expect(
      screen.queryByRole("button", { name: /Endre oppfølgingsplanen/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Lag en ny plan$/i }),
    ).not.toBeInTheDocument();
  });

  test("renders the PDF button in the button layout", () => {
    render(<AktivPlanButtons planId="plan-123" hasUtkast={false} />);

    expect(
      screen.getByRole("button", { name: /Vis PDF/i }),
    ).toBeInTheDocument();
  });
});
