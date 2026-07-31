"use client";

import {
  BodyLong,
  BodyShort,
  Button,
  ExpansionCard,
  HStack,
  InlineMessage,
  List,
  VStack,
} from "@navikt/ds-react";
import { useId, useState } from "react";

interface LokalDemoInnslag {
  id: string;
  tidspunkt: string;
  tekst: string;
}

export function BehovsvurderingLokalDemo() {
  const titleId = useId();
  const [bekreftet, setBekreftet] = useState(false);
  const [historikk, setHistorikk] = useState<LokalDemoInnslag[]>([]);

  function handleBekreft() {
    const nyInnslag: LokalDemoInnslag = {
      id: crypto.randomUUID(),
      tidspunkt: new Date().toLocaleString("nb-NO", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      tekst: "Bekreftet at oppfølgingsplan ikke er aktuell nå",
    };
    setHistorikk((prev) => [nyInnslag, ...prev]);
    setBekreftet(true);
  }

  function handleAngre() {
    setBekreftet(false);
  }

  return (
    <ExpansionCard aria-labelledby={titleId}>
      <ExpansionCard.Header>
        <ExpansionCard.Title as="h3" id={titleId}>
          Oppfølgingsplan er ikke aktuell nå
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap="space-16">
          <BodyLong>
            Hvis dere allerede har god dialog og en oppfølgingsplan ikke er
            nødvendig, kan du bekrefte det her. Du kan alltids lage en plan
            likevel ved å bruke knappen ovenfor.
          </BodyLong>

          {!bekreftet ? (
            <Button variant="secondary" onClick={handleBekreft}>
              Bekreft at oppfølgingsplan ikke er aktuell nå
            </Button>
          ) : (
            <VStack gap="space-12">
              <InlineMessage status="success" role="status">
                Du har bekreftet at oppfølgingsplan ikke er aktuell nå.
                Kvitteringen vises bare i denne demoen.
              </InlineMessage>
              <HStack gap="space-8">
                <Button variant="tertiary" onClick={handleAngre}>
                  Angre
                </Button>
              </HStack>
            </VStack>
          )}

          {historikk.length > 0 && (
            <VStack gap="space-4">
              <BodyShort weight="semibold">Historikk (demo)</BodyShort>
              <List as="ul" size="small">
                {historikk.map((innslag) => (
                  <List.Item key={innslag.id}>
                    {innslag.tidspunkt} — {innslag.tekst}
                  </List.Item>
                ))}
              </List>
            </VStack>
          )}
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
