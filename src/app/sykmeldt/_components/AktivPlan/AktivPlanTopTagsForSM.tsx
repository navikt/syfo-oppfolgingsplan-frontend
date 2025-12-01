"use client";

import { HStack } from "@navikt/ds-react";
import PlanDelingStatusTags from "@/common/components/PlanLinkCard/PlanLinkCardFooterTags";
import { usePlanDelingStatusContext } from "./PlanDelingStatusContextForSM";

export function AktivPlanTopTagsForSM() {
  const { deltMedLegeTidspunkt, deltMedVeilederTidspunkt } =
    usePlanDelingStatusContext();

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
