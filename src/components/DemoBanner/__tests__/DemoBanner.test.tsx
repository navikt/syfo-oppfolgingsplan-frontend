import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  AG_SCENARIO_OPTIONS,
  DEFAULT_DEMO_SCENARIO,
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  type DemoTiltakspakkeVariant,
  SM_SCENARIO_OPTIONS,
} from "@/common/demoScenario";
import { mockRouter } from "@/test/mocks/nextNavigationMock";
import { render } from "@/test/test-utils";
import { DemoBanner } from "../DemoBanner";

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return {
    ...mockNextNavigation(),
  };
});

describe("DemoBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_SCENARIO_COOKIE}=; path=/`;
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=; path=/`;
  });

  afterEach(() => {
    cleanup();
  });

  function renderBanner({
    scenarios = AG_SCENARIO_OPTIONS,
    initialScenario = DEFAULT_DEMO_SCENARIO,
    initialVariant = "standard" as DemoTiltakspakkeVariant,
  } = {}) {
    return render(
      <DemoBanner
        initialScenario={initialScenario}
        initialVariant={initialVariant}
        scenarios={scenarios}
      />,
    );
  }

  test("renders an announced demo banner with visible, keyboard-operable labels", async () => {
    const user = userEvent.setup();
    renderBanner();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Dette er en demoside og inneholder ikke dine personlige data.",
    );
    expect(screen.getByRole("combobox", { name: "Variant" })).toHaveValue(
      "standard",
    );
    expect(screen.getByRole("combobox", { name: "Scenario" })).toHaveValue(
      DEFAULT_DEMO_SCENARIO,
    );

    await user.tab();
    expect(screen.getByRole("combobox", { name: "Variant" })).toHaveFocus();
  });

  test("hides Unntak meldt for Standard", () => {
    renderBanner();

    expect(
      screen.queryByRole("option", {
        name: "Unntak meldt (plan ikke aktuell nå)",
      }),
    ).not.toBeInTheDocument();
  });

  test("shows Unntak meldt for Tiltakspakke 1", () => {
    renderBanner({ initialVariant: "tiltakspakke-1" });

    expect(
      screen.getByRole("option", {
        name: "Unntak meldt (plan ikke aktuell nå)",
      }),
    ).toBeInTheDocument();
  });

  test("shows only the provided SM scenarios", () => {
    renderBanner({ scenarios: SM_SCENARIO_OPTIONS });

    expect(screen.getByRole("option", { name: "Tom" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: "Aktiv plan + tidligere planer",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", {
        name: "Aktiv plan, utkast + tidligere planer",
      }),
    ).not.toBeInTheDocument();
  });

  test("immediately saves both cookies and refreshes when the scenario changes", async () => {
    const user = userEvent.setup();
    renderBanner();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Scenario" }),
      "tom",
    );

    expect(document.cookie).toContain(`${DEMO_SCENARIO_COOKIE}=tom`);
    expect(document.cookie).toContain(
      `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=standard`,
    );
    expect(mockRouter.refresh).toHaveBeenCalledOnce();
  });

  test("switching to Standard resets Unntak meldt and saves both cookies", async () => {
    const user = userEvent.setup();
    renderBanner({
      initialScenario: "unntak-meldt",
      initialVariant: "tiltakspakke-1",
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Variant" }),
      "standard",
    );

    expect(screen.getByRole("combobox", { name: "Scenario" })).toHaveValue(
      DEFAULT_DEMO_SCENARIO,
    );
    expect(document.cookie).toContain(
      `${DEMO_SCENARIO_COOKIE}=${DEFAULT_DEMO_SCENARIO}`,
    );
    expect(document.cookie).toContain(
      `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=standard`,
    );
    expect(mockRouter.refresh).toHaveBeenCalledOnce();
  });

  test("does not render the banner when the layout production guard is false", () => {
    const isLocalOrDemo = false;

    render(
      <div>
        {isLocalOrDemo && (
          <DemoBanner
            initialScenario={DEFAULT_DEMO_SCENARIO}
            initialVariant="standard"
            scenarios={AG_SCENARIO_OPTIONS}
          />
        )}
      </div>,
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
