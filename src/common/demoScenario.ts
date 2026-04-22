export const DEMO_SCENARIO_PARAM = "scenario";

export type DemoScenario =
  | "tom"
  | "aktiv-og-tidligere"
  | "aktiv-utkast-og-tidligere";

export const DEFAULT_DEMO_SCENARIO: DemoScenario = "aktiv-og-tidligere";

const VALID_SCENARIOS: DemoScenario[] = [
  "tom",
  "aktiv-og-tidligere",
  "aktiv-utkast-og-tidligere",
];

export function parseDemoScenario(
  value: string | string[] | undefined,
): DemoScenario {
  if (
    typeof value === "string" &&
    VALID_SCENARIOS.includes(value as DemoScenario)
  ) {
    return value as DemoScenario;
  }
  return DEFAULT_DEMO_SCENARIO;
}

export type DemoScenarioOption = {
  value: DemoScenario;
  label: string;
};

export const AG_SCENARIO_OPTIONS: DemoScenarioOption[] = [
  { value: "tom", label: "Tom" },
  { value: "aktiv-og-tidligere", label: "Aktiv plan + tidligere planer" },
  {
    value: "aktiv-utkast-og-tidligere",
    label: "Aktiv plan, utkast + tidligere planer",
  },
];

export const SM_SCENARIO_OPTIONS: DemoScenarioOption[] = [
  { value: "tom", label: "Tom" },
  { value: "aktiv-og-tidligere", label: "Aktiv plan + tidligere planer" },
];
