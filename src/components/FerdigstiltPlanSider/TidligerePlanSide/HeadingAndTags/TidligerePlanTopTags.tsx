import { HStack } from "@navikt/ds-react";
import PlanDelingStatusTags from "@/components/OversiktSide/PlanListe/PlanLinkCard/PlanLinkCardFooterTags";

interface Props {
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
}

export function TidligerePlanTopTags({
  isDeltMedLege,
  isDeltMedVeileder,
}: Props) {
  return (
    <HStack gap="space-8">
      <PlanDelingStatusTags
        tagSize="small"
        isDeltMedLege={isDeltMedLege}
        isDeltMedVeileder={isDeltMedVeileder}
      />
    </HStack>
  );
}
