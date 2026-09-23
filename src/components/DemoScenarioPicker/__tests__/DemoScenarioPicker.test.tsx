import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  AG_SCENARIO_OPTIONS,
  DEFAULT_DEMO_SCENARIO,
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_OPTIONS,
  SM_SCENARIO_OPTIONS,
} from "@/common/demoScenario";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { mockRouter } from "@/test/mocks/nextNavigationMock";
import { render } from "@/test/test-utils";
import { DemoScenarioPicker } from "../DemoScenarioPicker";

const mockEnv = vi.hoisted(() => ({ isLocalOrDemo: true }));

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return {
    ...mockNextNavigation(),
  };
});

vi.mock("@/env-variables/envHelpers", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/env-variables/envHelpers")>();
  return {
    ...original,
    get isLocalOrDemo() {
      return mockEnv.isLocalOrDemo;
    },
  };
});

describe("DemoScenarioPicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.isLocalOrDemo = true;
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_SCENARIO_COOKIE}=; path=/`;
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=; path=/`;
  });

  afterEach(() => {
    cleanup();
  });

  test("renders the Demo button with correct label", () => {
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    const button = screen.getByRole("button", { name: /demo/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Demo");
  });

  test("opens modal when clicking the Demo button", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    expect(
      screen.getByRole("heading", { name: /Demo-scenario/i }),
    ).toBeInTheDocument();
  });

  test("hides the unntak scenario for Standard while showing the other AG scenarios", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    for (const option of AG_SCENARIO_OPTIONS.filter(
      ({ value }) => value !== "unntak-meldt",
    )) {
      expect(
        screen.getByRole("radio", { name: option.label }),
      ).toBeInTheDocument();
    }

    expect(
      screen.queryByRole("radio", {
        name: "Unntak meldt (plan ikke aktuell nå)",
      }),
    ).not.toBeInTheDocument();
  });

  test("shows the unntak scenario for Tiltakspakke 1", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));
    await user.click(screen.getByRole("radio", { name: "Tiltakspakke 1" }));

    expect(
      screen.getByRole("radio", {
        name: "Unntak meldt (plan ikke aktuell nå)",
      }),
    ).toBeInTheDocument();
  });

  test("shows only SM scenarios when SM options are passed as prop", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={SM_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    for (const option of SM_SCENARIO_OPTIONS) {
      expect(
        screen.getByRole("radio", { name: option.label }),
      ).toBeInTheDocument();
    }

    // AG-only scenario "aktiv-utkast-og-tidligere" should NOT be shown
    const agOnlyOption = AG_SCENARIO_OPTIONS.find(
      (o) => !SM_SCENARIO_OPTIONS.some((s) => s.value === o.value),
    );
    if (agOnlyOption) {
      expect(
        screen.queryByRole("radio", { name: agOnlyOption.label }),
      ).not.toBeInTheDocument();
    }
  });

  test("selects scenario and saves cookie before refresh", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    await user.click(screen.getByRole("radio", { name: "Tom" }));
    await user.click(screen.getByRole("radio", { name: "Tiltakspakke 1" }));

    mockRouter.refresh.mockImplementationOnce(() => {
      expect(document.cookie).toContain(`${DEMO_SCENARIO_COOKIE}=tom`);
      expect(document.cookie).toContain(
        `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=tiltakspakke-1`,
      );
    });

    await user.click(screen.getByRole("button", { name: "Bruk valg" }));

    expect(document.cookie).toContain(`${DEMO_SCENARIO_COOKIE}=tom`);
    expect(document.cookie).toContain(
      `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=tiltakspakke-1`,
    );
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  test("shows independently selectable tiltakspakke variants", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    for (const option of DEMO_TILTAKSPAKKE_VARIANT_OPTIONS) {
      expect(
        screen.getByRole("radio", { name: option.label }),
      ).toBeInTheDocument();
    }

    expect(screen.getByRole("radio", { name: "Standard" })).toBeChecked();
  });

  test("switching from Tiltakspakke 1 unntak to Standard with keyboard resets to the default scenario", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    const standard = screen.getByRole("radio", { name: "Standard" });
    await user.click(standard);
    expect(standard).toHaveFocus();

    await user.keyboard("{ArrowDown}");

    const tiltakspakke1 = screen.getByRole("radio", {
      name: "Tiltakspakke 1",
    });
    expect(tiltakspakke1).toBeChecked();
    expect(tiltakspakke1).toHaveFocus();

    await user.click(
      screen.getByRole("radio", {
        name: "Unntak meldt (plan ikke aktuell nå)",
      }),
    );
    expect(
      screen.getByRole("radio", {
        name: "Unntak meldt (plan ikke aktuell nå)",
      }),
    ).toBeChecked();

    await user.click(tiltakspakke1);
    await user.keyboard("{ArrowUp}");

    expect(standard).toBeChecked();
    expect(standard).toHaveFocus();
    expect(
      screen.getByRole("radio", {
        name: "Aktiv plan + tidligere planer",
      }),
    ).toBeChecked();
    expect(
      screen.queryByRole("radio", {
        name: "Unntak meldt (plan ikke aktuell nå)",
      }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Bruk valg" }));

    expect(document.cookie).toContain(
      `${DEMO_SCENARIO_COOKIE}=${DEFAULT_DEMO_SCENARIO}`,
    );
    expect(document.cookie).toContain(
      `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=standard`,
    );
  });

  test("closes modal when clicking cancel", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));
    expect(
      screen.getByRole("heading", { name: /Demo-scenario/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Avbryt/i }));

    expect(
      screen.queryByRole("heading", { name: /Demo-scenario/i }),
    ).not.toBeInTheDocument();
  });

  test("modal shows 'Velg scenario' text as legend", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    expect(screen.getByText("Velg scenario")).toBeInTheDocument();
  });

  test("default scenario is preselected when opening modal", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    const defaultRadio = screen.getByRole("radio", {
      name: "Aktiv plan + tidligere planer",
    });
    expect(defaultRadio).toBeChecked();
  });

  test("preselects scenario and variant independently from cookies", async () => {
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_SCENARIO_COOKIE}=tom`;
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=tiltakspakke-1`;

    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    expect(screen.getByRole("radio", { name: "Tom" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Tiltakspakke 1" })).toBeChecked();
  });

  test("normalizes persisted Standard and unntak-meldt when applied", async () => {
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_SCENARIO_COOKIE}=unntak-meldt`;
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=standard`;

    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    expect(screen.getByRole("radio", { name: "Standard" })).toBeChecked();
    expect(
      screen.getByRole("radio", {
        name: "Aktiv plan + tidligere planer",
      }),
    ).toBeChecked();
    expect(
      screen.queryByRole("radio", {
        name: "Unntak meldt (plan ikke aktuell nå)",
      }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Bruk valg" }));

    expect(document.cookie).toContain(
      `${DEMO_SCENARIO_COOKIE}=${DEFAULT_DEMO_SCENARIO}`,
    );
    expect(document.cookie).toContain(
      `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=standard`,
    );
  });

  describe("production guard (isLocalOrDemo)", () => {
    /**
     * Layouts use `{isLocalOrDemo && <DemoScenarioPicker ... />}`.
     * We simulate this pattern to verify the picker is not rendered
     * when isLocalOrDemo is false (prod / dev-gcp).
     */
    test("does NOT render DemoScenarioPicker when isLocalOrDemo is false", () => {
      mockEnv.isLocalOrDemo = false;

      render(
        <div>
          {isLocalOrDemo && (
            <DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />
          )}
        </div>,
      );

      expect(
        screen.queryByRole("button", { name: /demo/i }),
      ).not.toBeInTheDocument();
    });

    test("renders DemoScenarioPicker when isLocalOrDemo is true", () => {
      mockEnv.isLocalOrDemo = true;

      render(
        <div>
          {isLocalOrDemo && (
            <DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />
          )}
        </div>,
      );

      expect(screen.getByRole("button", { name: /demo/i })).toBeInTheDocument();
    });
  });
});
