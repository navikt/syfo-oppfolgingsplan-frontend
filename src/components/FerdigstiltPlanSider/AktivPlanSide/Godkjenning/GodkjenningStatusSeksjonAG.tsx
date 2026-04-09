"use client";

import {
  CheckmarkCircleIcon,
  ClockIcon,
  ExclamationmarkTriangleIcon,
  XMarkOctagonIcon,
} from "@navikt/aksel-icons";
import {
  BodyLong,
  Box,
  Button,
  Heading,
  HStack,
  VStack,
} from "@navikt/ds-react";
import { type ReactNode, useRef } from "react";
import { useGodkjenningContext } from "./GodkjenningContext";
import { OverstyrGodkjenningModal } from "./OverstyrGodkjenningModal";

function StatusHeader({ icon, heading }: { icon: ReactNode; heading: string }) {
  return (
    <HStack gap="space-8" align="center">
      {icon}
      <Heading level="3" size="small">
        {heading}
      </Heading>
    </HStack>
  );
}

function UtdypendeTekstBoks({ label, text }: { label: string; text: string }) {
  return (
    <Box
      padding="space-16"
      borderRadius="12"
      borderColor="neutral-subtle"
      borderWidth="1"
    >
      <VStack gap="space-8">
        <BodyLong weight="semibold">{label}</BodyLong>
        <BodyLong>{text}</BodyLong>
      </VStack>
    </Box>
  );
}

export function GodkjenningStatusSeksjonAG() {
  const { status } = useGodkjenningContext();
  const overstyrModalRef = useRef<HTMLDialogElement>(null);

  function openOverstyrModal() {
    overstyrModalRef.current?.showModal();
  }

  const overstyrButton = (
    <Button type="button" variant="secondary" onClick={openOverstyrModal}>
      Overstyr godkjenning
    </Button>
  );

  let content: ReactNode;

  switch (status.type) {
    case "IKKE_BESVART":
      content = (
        <Box
          background="warning-soft"
          padding="space-24"
          borderRadius="12"
          borderColor="warning-subtle"
          borderWidth="1"
        >
          <VStack gap="space-16">
            <StatusHeader
              icon={<ClockIcon aria-hidden />}
              heading="Venter på godkjenning fra den sykmeldte"
            />

            <BodyLong>
              Den sykmeldte har ikke godkjent planen ennå. Du kan ikke sende
              planen til fastlege eller Nav før den er godkjent.
            </BodyLong>

            {overstyrButton}
          </VStack>
        </Box>
      );
      break;

    case "GODKJENT":
      content = (
        <Box
          background="success-soft"
          padding="space-24"
          borderRadius="12"
          borderColor="success-subtle"
          borderWidth="1"
        >
          <VStack gap="space-16">
            <StatusHeader
              icon={<CheckmarkCircleIcon aria-hidden />}
              heading="Den sykmeldte har godkjent planen"
            />

            <BodyLong>Du kan nå sende planen til fastlege og Nav.</BodyLong>
          </VStack>
        </Box>
      );
      break;

    case "AVSLATT":
      content = (
        <Box
          background="danger-soft"
          padding="space-24"
          borderRadius="12"
          borderColor="danger-subtle"
          borderWidth="1"
        >
          <VStack gap="space-16">
            <StatusHeader
              icon={<XMarkOctagonIcon aria-hidden />}
              heading="Den sykmeldte har ikke godkjent planen"
            />

            {status.kommentar ? (
              <UtdypendeTekstBoks
                label="Kommentar fra den sykmeldte:"
                text={status.kommentar}
              />
            ) : null}

            {overstyrButton}
          </VStack>
        </Box>
      );
      break;

    case "OVERSTYRT":
      content = (
        <Box
          background="neutral-soft"
          padding="space-24"
          borderRadius="12"
          borderColor="neutral-subtle"
          borderWidth="1"
        >
          <VStack gap="space-16">
            <StatusHeader
              icon={<ExclamationmarkTriangleIcon aria-hidden />}
              heading="Du har overstyrt godkjenningen"
            />

            <BodyLong>
              Planen kan sendes til fastlege og Nav uten den sykmeldtes
              godkjenning.
            </BodyLong>

            <UtdypendeTekstBoks
              label="Din begrunnelse:"
              text={status.begrunnelse}
            />
          </VStack>
        </Box>
      );
      break;

    default: {
      const exhaustiveCheck: never = status;
      throw new Error(`Unknown godkjenning status: ${exhaustiveCheck}`);
    }
  }

  return (
    <>
      <div aria-live="polite">{content}</div>
      <OverstyrGodkjenningModal ref={overstyrModalRef} />
    </>
  );
}

export default GodkjenningStatusSeksjonAG;
