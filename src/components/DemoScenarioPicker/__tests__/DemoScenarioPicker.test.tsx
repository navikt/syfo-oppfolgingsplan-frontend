import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  AG_SCENARIO_OPTIONS,
  DEMO_SCENARIO_COOKIE,
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

  test("shows all AG scenarios as radio buttons", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    for (const option of AG_SCENARIO_OPTIONS) {
      expect(
        screen.getByRole("radio", { name: option.label }),
      ).toBeInTheDocument();
    }
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

    await user.click(screen.getByRole("button", { name: /Bruk scenario/i }));

    expect(document.cookie).toContain(`${DEMO_SCENARIO_COOKIE}=tom`);
    expect(mockRouter.refresh).toHaveBeenCalled();
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

  test("preselects scenario from cookie", async () => {
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_SCENARIO_COOKIE}=tom`;

    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    expect(screen.getByRole("radio", { name: "Tom" })).toBeChecked();
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
        <>
          {isLocalOrDemo && (
            <DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />
          )}
        </>,
      );

      expect(
        screen.queryByRole("button", { name: /demo/i }),
      ).not.toBeInTheDocument();
    });

    test("renders DemoScenarioPicker when isLocalOrDemo is true", () => {
      mockEnv.isLocalOrDemo = true;

      render(
        <>
          {isLocalOrDemo && (
            <DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />
          )}
        </>,
      );

      expect(screen.getByRole("button", { name: /demo/i })).toBeInTheDocument();
    });
  });
});
