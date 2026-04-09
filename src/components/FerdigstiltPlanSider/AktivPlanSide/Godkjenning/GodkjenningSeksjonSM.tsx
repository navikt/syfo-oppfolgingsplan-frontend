"use client";

import {
  Alert,
  BodyLong,
  Box,
  Button,
  Heading,
  HStack,
  Textarea,
  VStack,
} from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { useGodkjenningContext } from "./GodkjenningContext";
import { OverstyrtVarselSM } from "./OverstyrtVarselSM";

export function GodkjenningSeksjonSM() {
  const { status, avslaa, godkjenn } = useGodkjenningContext();
  const [showAvslagForm, setShowAvslagForm] = useState(false);
  const [kommentar, setKommentar] = useState("");

  useEffect(() => {
    if (status.type !== "IKKE_BESVART") {
      setShowAvslagForm(false);
      setKommentar("");
    }
  }, [status.type]);

  const handleSendAvslag = () => {
    const trimmedKommentar = kommentar.trim();
    avslaa(trimmedKommentar.length > 0 ? trimmedKommentar : null);
  };

  if (status.type === "GODKJENT") {
    return (
      <Alert variant="success" role="status">
        <Heading level="3" size="small" spacing>
          Du har godkjent oppfølgingsplanen
        </Heading>
        <BodyLong>
          Arbeidsgiveren din kan nå sende planen til fastlegen din og Nav.
        </BodyLong>
      </Alert>
    );
  }

  if (status.type === "AVSLATT") {
    return (
      <Alert variant="warning" role="status">
        <Heading level="3" size="small" spacing>
          Du har ikke godkjent planen
        </Heading>

        <VStack gap="space-8">
          {status.kommentar && (
            <BodyLong>Din kommentar: {status.kommentar}</BodyLong>
          )}

          <BodyLong>
            Arbeidsgiveren din kan fortsatt velge å sende planen, men må oppgi
            en begrunnelse.
          </BodyLong>
        </VStack>
      </Alert>
    );
  }

  if (status.type === "OVERSTYRT") {
    return <OverstyrtVarselSM begrunnelse={status.begrunnelse} />;
  }

  return (
    <Box
      background="info-soft"
      borderColor="info-subtle"
      borderRadius="12"
      borderWidth="1"
      padding="space-24"
    >
      <VStack gap="space-16">
        <div>
          <Heading level="3" size="small" spacing>
            Godkjenn oppfølgingsplanen
          </Heading>
          <BodyLong>
            Arbeidsgiveren din har delt denne oppfølgingsplanen med deg. Les
            gjennom planen og ta stilling til om du godkjenner innholdet.
          </BodyLong>
        </div>

        <HStack gap="space-12" wrap>
          <Button type="button" variant="primary" onClick={godkjenn}>
            Godkjenn plan
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAvslagForm(true)}
          >
            Ikke godkjenn
          </Button>
        </HStack>

        {showAvslagForm && (
          <VStack gap="space-12">
            <Textarea
              label="Kommentar (valgfri)"
              description="Forklar gjerne hva du er uenig i"
              maxLength={500}
              minRows={4}
              resize="vertical"
              value={kommentar}
              onChange={(event) => setKommentar(event.target.value)}
            />

            <HStack gap="space-12" wrap>
              <Button type="button" variant="danger" onClick={handleSendAvslag}>
                Send avslag
              </Button>
              <Button
                type="button"
                variant="tertiary"
                onClick={() => {
                  setShowAvslagForm(false);
                  setKommentar("");
                }}
              >
                Avbryt
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
