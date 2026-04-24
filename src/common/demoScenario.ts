export const DEMO_SCENARIO_COOKIE = "demo-scenario";

const VALID_SCENARIOS = [
  "tom",
  "aktiv-og-tidligere",
  "aktiv-utkast-og-tidligere",
] as const;

export type DemoScenario = (typeof VALID_SCENARIOS)[number];

export const DEFAULT_DEMO_SCENARIO: DemoScenario = "aktiv-og-tidligere";

export function parseDemoScenario(
  value: string | string[] | undefined,
): DemoScenario {
  if (
    typeof value === "string" &&
    (VALID_SCENARIOS as readonly string[]).includes(value)
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
