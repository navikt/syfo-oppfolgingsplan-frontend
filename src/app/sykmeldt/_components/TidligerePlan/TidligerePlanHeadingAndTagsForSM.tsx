import { Heading, VStack } from "@navikt/ds-react";
import { TidligerePlanTopTagsForSM } from "./TidligerePlanTopTagsForSM";

interface Props {
  arbeidsstedNavn: string;
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
}

export function TidligerePlanHeadingAndTagsForSM({
  arbeidsstedNavn,
  isDeltMedLege,
  isDeltMedVeileder,
}: Props) {
  return (
    <VStack gap="2">
      <Heading level="2" size="xlarge">
        Oppfølgingsplan {arbeidsstedNavn}
      </Heading>

      <TidligerePlanTopTagsForSM
        isDeltMedLege={isDeltMedLege}
        isDeltMedVeileder={isDeltMedVeileder}
      />
    </VStack>
  );
}
