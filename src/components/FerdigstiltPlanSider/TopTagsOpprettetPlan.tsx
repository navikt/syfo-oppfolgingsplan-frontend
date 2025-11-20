import { HStack } from "@navikt/ds-react";
import PlanDelingStatusTags from "@/components/OversiktSide/PlanListe/PlanLinkCard/PlanLinkCardFooterTags";

interface Props {
  isDeltMedLege: boolean;
  isDeltMedNav: boolean;
}

export function TopTagsOpprettetPlan({ isDeltMedLege, isDeltMedNav }: Props) {
  return (
    <HStack gap="2">
      <PlanDelingStatusTags
        tagSize="small"
        isDeltMedLege={isDeltMedLege}
        isDeltMedNav={isDeltMedNav}
      />
    </HStack>
  );
}
