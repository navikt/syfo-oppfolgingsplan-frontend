import { HStack, Heading, VStack } from "@navikt/ds-react";
import PlanDelingStatusTags from "@/components/OversiktSide/PlanListe/PlanLinkCard/PlanLinkCardFooterTags.tsx";

interface Props {
  arbeidsstedNavn: string;
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
}

export function AktivPlanHeadingAndTagsSM({
  arbeidsstedNavn,
  isDeltMedLege,
  isDeltMedVeileder,
}: Props) {
  return (
    <VStack gap="2">
      <Heading level="2" size="xlarge">
        Oppfølgingsplan {arbeidsstedNavn}
      </Heading>
      <HStack gap="2">
        <PlanDelingStatusTags
          tagSize="small"
          isDeltMedLege={isDeltMedLege}
          isDeltMedVeileder={isDeltMedVeileder}
        />
      </HStack>
    </VStack>
  );
}
