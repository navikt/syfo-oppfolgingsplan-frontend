import { BodyLong, Box, Heading } from "@navikt/ds-react";
import { DelPlanMedLegeButtonAndStatus } from "./DelPlanMedLegeButtonAndStatus";
import { DelPlanMedVeilederButtonAndStatus } from "./DelPlanMedVeilederButtonAndStatus";

interface Props {
  planId: string;
  userHasEditAccess: boolean;
}

export default function DelAktivPlanMedLegeEllerNav({
  planId,
  userHasEditAccess,
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

      <DelPlanMedLegeButtonAndStatus
        planId={planId}
        userHasEditAccess={userHasEditAccess}
      />

      <BodyLong className="mt-6 mb-6">
        Oppfølgingsplanen skal sendes til veileder i Nav senest en uke før et
        dialogmøte, eller når Nav ber om det. Nav får ikke tilgang til
        oppfølgingsplanen før du velger å sende den til Nav-veileder.
      </BodyLong>

      <DelPlanMedVeilederButtonAndStatus
        planId={planId}
        userHasEditAccess={userHasEditAccess}
      />
    </Box>
  );
}
