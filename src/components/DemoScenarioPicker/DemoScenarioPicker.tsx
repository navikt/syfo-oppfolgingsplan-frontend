"use client";

import { TestFlaskIcon } from "@navikt/aksel-icons";
import {
  Box,
  Button,
  Modal,
  Radio,
  RadioGroup,
  VStack,
} from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DEFAULT_DEMO_SCENARIO,
  DEFAULT_DEMO_TILTAKSPAKKE_VARIANT,
  DEMO_SCENARIO_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_COOKIE,
  DEMO_TILTAKSPAKKE_VARIANT_OPTIONS,
  type DemoScenario,
  type DemoScenarioOption,
  type DemoTiltakspakkeVariant,
  getAvailableDemoScenarioOptions,
  parseDemoScenario,
  parseDemoTiltakspakkeVariant,
} from "@/common/demoScenario";

export function DemoScenarioPicker({
  scenarios,
}: {
  scenarios: DemoScenarioOption[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DemoScenario>(DEFAULT_DEMO_SCENARIO);
  const [selectedVariant, setSelectedVariant] =
    useState<DemoTiltakspakkeVariant>(DEFAULT_DEMO_TILTAKSPAKKE_VARIANT);

  function handleOpen() {
    const getCookieValue = (name: string) => {
      return document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((cookie) => cookie.startsWith(`${name}=`))
        ?.split("=")
        .slice(1)
        .join("=");
    };
    const variant = parseDemoTiltakspakkeVariant(
      getCookieValue(DEMO_TILTAKSPAKKE_VARIANT_COOKIE),
    );
    const availableScenarios = getAvailableDemoScenarioOptions(
      scenarios,
      variant,
    );
    const parsed = parseDemoScenario(getCookieValue(DEMO_SCENARIO_COOKIE));
    const currentScenario = availableScenarios.some(
      (scenario) => scenario.value === parsed,
    )
      ? parsed
      : availableScenarios.some((s) => s.value === DEFAULT_DEMO_SCENARIO)
        ? DEFAULT_DEMO_SCENARIO
        : (availableScenarios[0]?.value ?? DEFAULT_DEMO_SCENARIO);

    setSelected(currentScenario);
    setSelectedVariant(variant);
    setOpen(true);
  }

  function handleApply() {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    // biome-ignore lint/suspicious/noDocumentCookie: task requires document.cookie to support current local/demo flow
    document.cookie = `${DEMO_SCENARIO_COOKIE}=${selected}; path=/; SameSite=Lax${secure}`;
    // biome-ignore lint/suspicious/noDocumentCookie: task requires document.cookie to support current local/demo flow
    document.cookie = `${DEMO_TILTAKSPAKKE_VARIANT_COOKIE}=${selectedVariant}; path=/; SameSite=Lax${secure}`;
    router.refresh();
    setOpen(false);
  }

  const availableScenarios = getAvailableDemoScenarioOptions(
    scenarios,
    selectedVariant,
  );

  return (
    <>
      <Box
        position="fixed"
        style={{
          bottom: "var(--ax-space-24)",
          right: "var(--ax-space-24)",
          zIndex: 100,
        }}
      >
        <Button
          variant="primary"
          size="medium"
          icon={<TestFlaskIcon aria-hidden />}
          onClick={handleOpen}
        >
          Demo
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        header={{ heading: "Demo-scenario", closeButton: true }}
        width="small"
      >
        <Modal.Body>
          <VStack gap="space-24">
            <RadioGroup
              legend="Velg scenario"
              value={selected}
              onChange={(value) => setSelected(parseDemoScenario(value))}
            >
              {availableScenarios.map(({ value, label }) => (
                <Radio key={value} value={value}>
                  {label}
                </Radio>
              ))}
            </RadioGroup>
            <RadioGroup
              legend="Velg variant"
              value={selectedVariant}
              onChange={(value) => {
                const variant = parseDemoTiltakspakkeVariant(value);
                setSelectedVariant(variant);

                if (variant === "standard" && selected === "unntak-meldt") {
                  setSelected(DEFAULT_DEMO_SCENARIO);
                }
              }}
            >
              {DEMO_TILTAKSPAKKE_VARIANT_OPTIONS.map(({ value, label }) => (
                <Radio key={value} value={value}>
                  {label}
                </Radio>
              ))}
            </RadioGroup>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleApply}>Bruk valg</Button>
          <Button variant="tertiary" onClick={() => setOpen(false)}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
