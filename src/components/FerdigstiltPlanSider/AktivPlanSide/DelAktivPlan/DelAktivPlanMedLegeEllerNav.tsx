import { BodyLong, Box, HStack, Heading } from "@navikt/ds-react";
import { DelPlanMedLegeButtonAndStatus } from "./DelPlanMedLegeButtonAndStatus";
import { DelPlanMedVeilederButtonAndStatus } from "./DelPlanMedVeilederButtonAndStatus";

interface Props {
  planId: string;
}

export default function DelAktivPlanMedLegeEllerNav({ planId }: Props) {
  return (
    <Box className="bg-ax-bg-accent-soft p-4 pb-6 rounded-lg">
      <HStack gap="space-16">
        <Heading level="3" size="medium">
          Del oppfølgingsplanen med fastlege og Nav
        </Heading>

        <BodyLong>
          Oppfølgingsplanen skal sendes til fastlegen senest innen den ansatte
          har vært helt eller delvis borte fra jobb i fire uker.
        </BodyLong>

        <DelPlanMedLegeButtonAndStatus planId={planId} />

        <BodyLong>
          Oppfølgingsplanen skal sendes til veileder i Nav senest en uke før et
          dialogmøte, eller når Nav ber om det. Nav får ikke tilgang til
          oppfølgingsplanen før du velger å sende den til Nav-veileder.
        </BodyLong>

        <DelPlanMedVeilederButtonAndStatus planId={planId} />
      </HStack>
    </Box>
  );
}
