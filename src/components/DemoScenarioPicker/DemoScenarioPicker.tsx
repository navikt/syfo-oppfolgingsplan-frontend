"use client";

import { TestFlaskIcon } from "@navikt/aksel-icons";
import { Box, Button, Modal, Radio, RadioGroup } from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DEFAULT_DEMO_SCENARIO,
  DEMO_SCENARIO_COOKIE,
  type DemoScenario,
  type DemoScenarioOption,
  parseDemoScenario,
} from "@/common/demoScenario";

export function DemoScenarioPicker({
  scenarios,
}: {
  scenarios: DemoScenarioOption[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DemoScenario>(DEFAULT_DEMO_SCENARIO);

  function handleOpen() {
    const cookieValue = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((cookie) => cookie.startsWith(`${DEMO_SCENARIO_COOKIE}=`))
      ?.split("=")
      .slice(1)
      .join("=");
    const parsed = parseDemoScenario(cookieValue);
    const currentScenario = scenarios.some(
      (scenario) => scenario.value === parsed,
    )
      ? parsed
      : scenarios.some((s) => s.value === DEFAULT_DEMO_SCENARIO)
        ? DEFAULT_DEMO_SCENARIO
        : (scenarios[0]?.value ?? DEFAULT_DEMO_SCENARIO);

    setSelected(currentScenario);
    setOpen(true);
  }

  function handleApply() {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    // biome-ignore lint/suspicious/noDocumentCookie: task requires document.cookie to support current local/demo flow
    document.cookie = `${DEMO_SCENARIO_COOKIE}=${selected}; path=/; SameSite=Lax${secure}`;
    router.refresh();
    setOpen(false);
  }

  return (
    <>
      <Box
        position="fixed"
        style={{
          bottom: "var(--a-spacing-6)",
          right: "var(--a-spacing-6)",
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
          <RadioGroup
            legend="Velg scenario"
            value={selected}
            onChange={(value) => setSelected(parseDemoScenario(value))}
          >
            {scenarios.map(({ value, label }) => (
              <Radio key={value} value={value}>
                {label}
              </Radio>
            ))}
          </RadioGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleApply}>Bruk scenario</Button>
          <Button variant="tertiary" onClick={() => setOpen(false)}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
