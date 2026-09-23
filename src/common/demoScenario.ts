export const DEMO_SCENARIO_COOKIE = "demo-scenario";
export const DEMO_TILTAKSPAKKE_VARIANT_COOKIE = "demo-tiltakspakke-variant";

const VALID_SCENARIOS = [
  "tom",
  "aktiv-og-tidligere",
  "aktiv-utkast-og-tidligere",
  "unntak-meldt",
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

const VALID_TILTAKSPAKKE_VARIANTS = ["standard", "tiltakspakke-1"] as const;

export type DemoTiltakspakkeVariant =
  (typeof VALID_TILTAKSPAKKE_VARIANTS)[number];

export const DEFAULT_DEMO_TILTAKSPAKKE_VARIANT: DemoTiltakspakkeVariant =
  "standard";

export function parseDemoTiltakspakkeVariant(
  value: string | string[] | undefined,
): DemoTiltakspakkeVariant {
  if (
    typeof value === "string" &&
    (VALID_TILTAKSPAKKE_VARIANTS as readonly string[]).includes(value)
  ) {
    return value as DemoTiltakspakkeVariant;
  }
  return DEFAULT_DEMO_TILTAKSPAKKE_VARIANT;
}

export type DemoScenarioOption = {
  value: DemoScenario;
  label: string;
};

export function getAvailableDemoScenarioOptions(
  scenarios: readonly DemoScenarioOption[],
  variant: DemoTiltakspakkeVariant,
): DemoScenarioOption[] {
  if (variant === "tiltakspakke-1") {
    return [...scenarios];
  }

  return scenarios.filter((scenario) => scenario.value !== "unntak-meldt");
}

export function resolveDemoScenario(
  scenarios: readonly DemoScenarioOption[],
  scenario: DemoScenario,
  variant: DemoTiltakspakkeVariant,
): DemoScenario {
  const availableScenarios = getAvailableDemoScenarioOptions(
    scenarios,
    variant,
  );

  if (
    availableScenarios.some(
      (availableScenario) => availableScenario.value === scenario,
    )
  ) {
    return scenario;
  }

  return (
    availableScenarios.find(
      (availableScenario) => availableScenario.value === DEFAULT_DEMO_SCENARIO,
    )?.value ??
    availableScenarios[0]?.value ??
    DEFAULT_DEMO_SCENARIO
  );
}

export const DEMO_TILTAKSPAKKE_VARIANT_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "tiltakspakke-1", label: "Tiltakspakke 1" },
] as const satisfies readonly {
  value: DemoTiltakspakkeVariant;
  label: string;
}[];

export const AG_SCENARIO_OPTIONS: DemoScenarioOption[] = [
  { value: "tom", label: "Tom" },
  { value: "aktiv-og-tidligere", label: "Aktiv plan + tidligere planer" },
  {
    value: "aktiv-utkast-og-tidligere",
    label: "Aktiv plan, utkast + tidligere planer",
  },
  { value: "unntak-meldt", label: "Unntak meldt (plan ikke aktuell nå)" },
];

export const SM_SCENARIO_OPTIONS: DemoScenarioOption[] = [
  { value: "tom", label: "Tom" },
  { value: "aktiv-og-tidligere", label: "Aktiv plan + tidligere planer" },
];
