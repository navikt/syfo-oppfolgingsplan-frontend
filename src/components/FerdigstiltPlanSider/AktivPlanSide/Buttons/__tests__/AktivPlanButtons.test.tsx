import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mockAkselModal } from "@/test/mocks/akselModalMock";
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

vi.mock("@navikt/ds-react", () => mockAkselModal());

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
