import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mockAnalytics } from "@/test/mocks/analyticsMock";
import { mockAkselModal } from "@/test/mocks/akselModalMock";
import { render } from "@/test/test-utils";
import { AktivPlanButtons } from "../AktivPlanButtons";

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import("@/test/mocks/nextNavigationMock");

  return mockNextNavigation();
});

vi.mock("@/common/analytics/logAnalyticsEvent", () => mockAnalytics());

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
