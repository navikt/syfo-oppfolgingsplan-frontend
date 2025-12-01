import { VStack } from "@navikt/ds-react";
import { FerdigstiltPlanHeadingForAG } from "../FerdigstiltPlanHeadingForAG";
import { TidligerePlanTopTagsForAG } from "./TidligerePlanTopTagsForAG";

interface Props {
  employeeName: string;
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
}

export function TidligerePlanHeadingAndTagsForAG({
  employeeName,
  isDeltMedLege,
  isDeltMedVeileder,
}: Props) {
  return (
    <VStack gap="2">
      <FerdigstiltPlanHeadingForAG employeeName={employeeName} />

      <TidligerePlanTopTagsForAG
        isDeltMedLege={isDeltMedLege}
        isDeltMedVeileder={isDeltMedVeileder}
      />
    </VStack>
  );
}
