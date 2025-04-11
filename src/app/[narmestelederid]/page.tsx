import { Arbeidssituasjon } from "@/components/form/arbeidssituasjon";
import React from "react";
import { OppfolgingsplanStepper } from "@/components/oppfolgingsplanStepper/oppfolgingsplanStepper";
import { VStack } from "@navikt/ds-react";
import { Tilrettelegging } from "@/components/form/tilrettelegging";
import { Oppfolging } from "@/components/form/oppfolging";

export default function Home() {
  return (
    <VStack gap="8">
      <OppfolgingsplanStepper />

      <Arbeidssituasjon />

      <Tilrettelegging />

      <Oppfolging />
    </VStack>
  );
}
