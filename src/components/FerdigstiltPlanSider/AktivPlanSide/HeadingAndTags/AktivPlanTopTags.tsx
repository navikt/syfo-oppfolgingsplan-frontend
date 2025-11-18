"use client";

import { HStack } from "@navikt/ds-react";
import PlanDelingStatusTags from "@/components/OversiktSide/PlanListe/PlanLinkCard/PlanLinkCardFooterTags";
import { usePlanDelingContext } from "../PlanDelingContext";

export function AktivPlanTopTags() {
  const { deltMedLegeTidspunkt, deltMedVeilederTidspunkt } =
    usePlanDelingContext();

  return (
    <HStack gap="2">
      <PlanDelingStatusTags
        tagSize="small"
        isDeltMedLege={Boolean(deltMedLegeTidspunkt)}
        isDeltMedVeileder={Boolean(deltMedVeilederTidspunkt)}
      />
    </HStack>
  );
}
