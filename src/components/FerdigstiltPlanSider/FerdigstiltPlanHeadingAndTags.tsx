import { Heading, VStack } from "@navikt/ds-react";
import { TopTagsOpprettetPlan } from "./TopTagsOpprettetPlan";

interface Props {
  employeeName: string;
  isDeltMedLege: boolean;
  isDeltMedNav: boolean;
}

export function FerdigstiltPlanHeadingAndTags({
  employeeName,
  isDeltMedLege,
  isDeltMedNav,
}: Props) {
  return (
    <VStack align="start">
      <Heading level="2" size="xlarge" className="mb-2">
        Oppfølgingsplan for {employeeName}
      </Heading>

      <TopTagsOpprettetPlan
        isDeltMedLege={isDeltMedLege}
        isDeltMedNav={isDeltMedNav}
      />
    </VStack>
  );
}
