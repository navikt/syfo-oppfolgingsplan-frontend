"use client";

import { TestFlaskIcon } from "@navikt/aksel-icons";
import { Button, Modal, Radio, RadioGroup } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  DEFAULT_DEMO_SCENARIO,
  DEMO_SCENARIO_PARAM,
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const currentScenario = parseDemoScenario(
    searchParams.get(DEMO_SCENARIO_PARAM) ?? undefined,
  );
  const [selected, setSelected] = useState<DemoScenario>(currentScenario);

  function handleOpen() {
    setSelected(currentScenario);
    setOpen(true);
  }

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString());
    params.set(DEMO_SCENARIO_PARAM, selected);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
        }}
      >
        <Button
          ref={buttonRef}
          variant="primary"
          size="medium"
          icon={<TestFlaskIcon aria-hidden />}
          onClick={handleOpen}
          aria-label="Velg demo-scenario"
        >
          Demo
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        header={{ heading: "Demo-scenario", closeButton: true }}
        width="small"
      >
        <Modal.Body>
          <RadioGroup
            legend="Velg scenario"
            value={selected ?? DEFAULT_DEMO_SCENARIO}
            onChange={(value) => setSelected(value as DemoScenario)}
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
