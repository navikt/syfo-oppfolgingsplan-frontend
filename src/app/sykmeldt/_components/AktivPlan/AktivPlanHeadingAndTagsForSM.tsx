import { Heading, VStack } from "@navikt/ds-react";
import { AktivPlanTopTagsForSM } from "./AktivPlanTopTagsForSM";

interface Props {
  arbeidsstedNavn: string;
}

export function AktivPlanHeadingAndTagsForSM({ arbeidsstedNavn }: Props) {
  return (
    <VStack gap="2">
      <Heading level="2" size="xlarge">
        Oppfølgingsplan {arbeidsstedNavn}
      </Heading>

      <AktivPlanTopTagsForSM />
    </VStack>
  );
}
