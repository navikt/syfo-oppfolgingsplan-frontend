"use client";

import { Box, GlobalAlert, HStack, Select, VStack } from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_OPTIONS,
  type DemoScenario,
  type DemoScenarioOption,
  type DemoTiltakspakkeVariant,
  getAvailableDemoScenarioOptions,
  parseDemoScenario,
  parseDemoTiltakspakkeVariant,
  resolveDemoScenario,
} from "@/common/demoScenario";

type DemoBannerProps = {
  scenarios: DemoScenarioOption[];
  initialScenario: DemoScenario;
  initialVariant: DemoTiltakspakkeVariant;
};

export function DemoBanner({
  scenarios,
  initialScenario,
  initialVariant,
}: DemoBannerProps) {
  const router = useRouter();
  const [scenario, setScenario] = useState(initialScenario);
  const [variant, setVariant] = useState(initialVariant);
  const [isPending, startTransition] = useTransition();

  const availableScenarios = getAvailableDemoScenarioOptions(
    scenarios,
    variant,
  );

  function applySelection(
    nextScenario: DemoScenario,
    nextVariant: DemoTiltakspakkeVariant,
  ) {
    setScenario(nextScenario);
    setVariant(nextVariant);

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    // biome-ignore lint/suspicious/noDocumentCookie: task requires document.cookie to support current local/demo flow
    document.cookie = `${DEMO_SCENARIO_COOKIE}=${nextScenario}; path=/; SameSite=Lax${secure}`;
    // biome-ignore lint/suspicious/noDocumentCookie: task requires document.cookie to support current local/demo flow
    document.cookie = `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=${nextVariant}; path=/; SameSite=Lax${secure}`;

    startTransition(() => {
      router.refresh();
    });
  }

  function handleVariantChange(value: string) {
    const nextVariant = parseDemoTiltakspakkeVariant(value);
    const nextScenario = resolveDemoScenario(scenarios, scenario, nextVariant);

    applySelection(nextScenario, nextVariant);
  }

  function handleScenarioChange(value: string) {
    const nextScenario = resolveDemoScenario(
      scenarios,
      parseDemoScenario(value),
      variant,
    );

    applySelection(nextScenario, variant);
  }

  return (
    <Box
      paddingBlock="space-16"
      paddingInline={{ xs: "space-16", md: "space-24" }}
    >
      <GlobalAlert as="div" centered={false} role="status" status="warning">
        <GlobalAlert.Content>
          <VStack gap="space-16">
            <div>
              Dette er en demoside og inneholder ikke dine personlige data.
            </div>
            <HStack gap="space-16" wrap>
              <Select
                disabled={isPending}
                label="Variant"
                onChange={(event) => handleVariantChange(event.target.value)}
                size="small"
                value={variant}
              >
                {DEMO_TILTAKSPAKKE_VARIANT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Select
                disabled={isPending}
                label="Scenario"
                onChange={(event) => handleScenarioChange(event.target.value)}
                size="small"
                value={scenario}
              >
                {availableScenarios.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </HStack>
          </VStack>
        </GlobalAlert.Content>
      </GlobalAlert>
    </Box>
  );
}
