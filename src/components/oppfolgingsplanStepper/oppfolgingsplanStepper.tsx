"use client";

import React, { useState } from "react";
import { Stepper } from "@navikt/ds-react";

export const OppfolgingsplanStepper = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <Stepper
      aria-labelledby="stepper-heading"
      activeStep={activeStep}
      onStepChange={setActiveStep}
      orientation="horizontal"
    >
      <Stepper.Step href="#">Oppfølgingsplan</Stepper.Step>
      <Stepper.Step href="#">Informasjon til Nav og lege</Stepper.Step>
      <Stepper.Step href="#">Innsending</Stepper.Step>
    </Stepper>
  );
};
