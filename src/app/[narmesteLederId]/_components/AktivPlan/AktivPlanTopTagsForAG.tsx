"use client";

import { HStack } from "@navikt/ds-react";
import PlanDelingStatusTags from "@/common/components/PlanLinkCard/PlanLinkCardFooterTags";
import { usePlanDelingContext } from "./PlanDelingContextForAG";

export function AktivPlanTopTagsForAG() {
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
