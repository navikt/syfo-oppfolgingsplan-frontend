import { HStack } from "@navikt/ds-react";
import PlanDelingStatusTags from "@/common/components/PlanLinkCard/PlanLinkCardFooterTags";

interface Props {
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
}

export function TidligerePlanTopTagsForSM({
  isDeltMedLege,
  isDeltMedVeileder,
}: Props) {
  return (
    <HStack gap="2">
      <PlanDelingStatusTags
        tagSize="small"
        isDeltMedLege={isDeltMedLege}
        isDeltMedVeileder={isDeltMedVeileder}
      />
    </HStack>
  );
}
