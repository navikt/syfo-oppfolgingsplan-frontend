import React from "react";
import { OppfolgingsplanStepper } from "@/components/oppfolgingsplanStepper/oppfolgingsplanStepper";
import { VStack } from "@navikt/ds-react";
import { OppfolgingsplanForm } from "@/components/form/oppfolgingsplan/oppfolgingsplanForm.tsx";
import { Flexjar } from "@/components/flexjar/flexjar.tsx";

export default function Home() {
  return (
    <VStack gap="8">
      <OppfolgingsplanStepper />

      <OppfolgingsplanForm />

      <Flexjar />
    </VStack>
  );
}
