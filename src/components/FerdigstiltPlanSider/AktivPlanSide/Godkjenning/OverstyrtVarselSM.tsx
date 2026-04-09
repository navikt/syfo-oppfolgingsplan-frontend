"use client";

import { Alert, BodyLong, Heading, VStack } from "@navikt/ds-react";

interface Props {
  begrunnelse: string;
}

export function OverstyrtVarselSM({ begrunnelse }: Props) {
  return (
    <Alert variant="warning">
      <Heading level="3" size="small" spacing>
        Arbeidsgiver har overstyrt godkjenningen
      </Heading>

      <VStack gap="space-8">
        <BodyLong>
          Arbeidsgiveren din har overstyrt godkjenningen og kan nå sende
          oppfølgingsplanen til fastlegen din og Nav uten ditt samtykke.
        </BodyLong>

        <VStack gap="space-8">
          <BodyLong weight="semibold">Begrunnelse fra arbeidsgiver:</BodyLong>
          <BodyLong>{begrunnelse}</BodyLong>
        </VStack>
      </VStack>
    </Alert>
  );
}
