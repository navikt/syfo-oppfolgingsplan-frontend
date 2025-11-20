"use client";

import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  HStack,
  Heading,
} from "@navikt/ds-react";
import { getLocaleDateAndTimeString } from "@/ui-helpers/dateAndTime";

interface Props {
  deltMedLegeTidspunkt: Date | null;
  deltMedVeilederTidspunkt: Date | null;
}

export default function DelAktivPlanMedLegeEllerNav({
  deltMedLegeTidspunkt,
  deltMedVeilederTidspunkt,
}: Props) {
  return (
    <Box className="bg-ax-bg-accent-soft p-4 pb-6 rounded-lg">
      <Heading level="3" size="medium" spacing>
        Del oppfølgingsplanen med fastlege og Nav
      </Heading>

      <BodyLong className="mb-6">
        Oppfølgingsplanen skal sendes til fastlegen senest innen den ansatte har
        vært helt eller delvis borte fra jobb i fire uker.
      </BodyLong>

      <HStack gap="8" align="center">
        {/* TODO: Improve responsive design */}
        <Box.New minWidth="220px">
          <Button variant="primary" disabled={Boolean(deltMedLegeTidspunkt)}>
            Send til fastlege
          </Button>
        </Box.New>

        {deltMedLegeTidspunkt && (
          <Alert variant="success" size="small" inline>
            <BodyShort>
              Delt med fastlege{" "}
              {getLocaleDateAndTimeString(deltMedLegeTidspunkt, "long")}.
            </BodyShort>
          </Alert>
        )}
      </HStack>

      <BodyLong className="mt-6 mb-6">
        Oppfølgingsplanen skal sendes til veileder i Nav senest en uke før et
        dialogmøte, eller når Nav ber om det. Nav får ikke tilgang til
        oppfølgingsplanen før du velger å sende den til Nav-veileder.
      </BodyLong>

      <HStack gap="8" align="center">
        <Box.New minWidth="220px">
          <Button
            variant="primary"
            disabled={Boolean(deltMedVeilederTidspunkt)}
          >
            Send til Nav-veileder
          </Button>
        </Box.New>

        {deltMedVeilederTidspunkt && (
          <Alert variant="success" size="small" inline>
            <BodyShort>
              Delt med Nav-veileder{" "}
              {getLocaleDateAndTimeString(deltMedVeilederTidspunkt, "long")}.
            </BodyShort>
          </Alert>
        )}
      </HStack>
    </Box>
  );
}
