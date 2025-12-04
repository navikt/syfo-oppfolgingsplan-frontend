import { Heading, VStack } from "@navikt/ds-react";
import { TidligerePlanTopTags } from "./TidligerePlanTopTags";

interface Props {
  arbeidsstedNavn: string;
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
}

export function TidligerePlanHeadingAndTagsSM({
  arbeidsstedNavn,
  isDeltMedLege,
  isDeltMedVeileder,
}: Props) {
  return (
    <VStack gap="2">
      <Heading level="2" size="xlarge">
        Oppfølgingsplan {arbeidsstedNavn}
      </Heading>

      <TidligerePlanTopTags
        isDeltMedLege={isDeltMedLege}
        isDeltMedVeileder={isDeltMedVeileder}
      />
    </VStack>
  );
}
