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
    document.cookie = `${DEMO_SCENARIO_COOKIE}=; path=/; max-age=0`;
  });

  afterEach(() => {
    cleanup();
  });

  test("rendrer Demo-knappen med riktig label", () => {
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    const button = screen.getByRole("button", { name: /demo/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Demo");
  });

  test("åpner modal ved klikk på Demo-knappen", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    expect(
      screen.getByRole("heading", { name: /Demo-scenario/i }),
    ).toBeInTheDocument();
  });

  test("viser alle AG-scenarioer som radio-knapper", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    for (const option of AG_SCENARIO_OPTIONS) {
      expect(
        screen.getByRole("radio", { name: option.label }),
      ).toBeInTheDocument();
    }
  });

  test("viser kun SM-scenarioer når SM-options sendes som prop", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={SM_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    // SM-scenarioer skal vises
    for (const option of SM_SCENARIO_OPTIONS) {
      expect(
        screen.getByRole("radio", { name: option.label }),
      ).toBeInTheDocument();
    }

    // AG-only scenario "aktiv-utkast-og-tidligere" skal IKKE vises
    const agOnlyOption = AG_SCENARIO_OPTIONS.find(
      (o) => !SM_SCENARIO_OPTIONS.some((s) => s.value === o.value),
    );
    if (agOnlyOption) {
      expect(
        screen.queryByRole("radio", { name: agOnlyOption.label }),
      ).not.toBeInTheDocument();
    }
  });

  test("velger scenario og lagrer cookie før refresh", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    // Velg "Tom"-scenarioet
    await user.click(screen.getByRole("radio", { name: "Tom" }));

    // Klikk "Bruk scenario"
    await user.click(screen.getByRole("button", { name: /Bruk scenario/i }));

    expect(document.cookie).toContain(`${DEMO_SCENARIO_COOKIE}=tom`);
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  test("lukker modal ved Avbryt", async () => {
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

  test("modal viser 'Velg scenario'-tekst som legend", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    expect(screen.getByText("Velg scenario")).toBeInTheDocument();
  });

  test("default-scenario er forhåndsvalgt ved åpning av modal", async () => {
    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    // Default er "aktiv-og-tidligere"
    const defaultRadio = screen.getByRole("radio", {
      name: "Aktiv plan + tidligere planer",
    });
    expect(defaultRadio).toBeChecked();
  });

  test("forhåndsvelger scenario fra cookie", async () => {
    // biome-ignore lint/suspicious/noDocumentCookie: tests need to control the browser cookie directly
    document.cookie = `${DEMO_SCENARIO_COOKIE}=tom`;

    const user = userEvent.setup();
    render(<DemoScenarioPicker scenarios={AG_SCENARIO_OPTIONS} />);

    await user.click(screen.getByRole("button", { name: /demo/i }));

    expect(screen.getByRole("radio", { name: "Tom" })).toBeChecked();
  });

  describe("produksjonsbeskyttelse (isLocalOrDemo-guard)", () => {
    /**
     * Layoutene bruker `{isLocalOrDemo && <DemoScenarioPicker ... />}`.
     * Vi simulerer dette mønsteret her for å verifisere at pickeren
     * ikke rendres når isLocalOrDemo er false (prod / dev-gcp).
     */
    test("rendrer IKKE DemoScenarioPicker når isLocalOrDemo er false", () => {
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

    test("rendrer DemoScenarioPicker når isLocalOrDemo er true", () => {
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
