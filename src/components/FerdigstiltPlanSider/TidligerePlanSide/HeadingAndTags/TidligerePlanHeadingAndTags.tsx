import { VStack } from "@navikt/ds-react";
import { FerdigstiltPlanHeading } from "../../Shared/FerdigstiltPlanHeading";
import { TidligerePlanTopTags } from "./TidligerePlanTopTags";

interface Props {
  employeeName: string;
  isDeltMedLege: boolean;
  isDeltMedVeileder: boolean;
}

export function TidligerePlanHeadingAndTags({
  employeeName,
  isDeltMedLege,
  isDeltMedVeileder,
}: Props) {
  return (
    <VStack gap="space-8">
      <FerdigstiltPlanHeading employeeName={employeeName} />
      <TidligerePlanTopTags
        isDeltMedLege={isDeltMedLege}
        isDeltMedVeileder={isDeltMedVeileder}
      />
    </VStack>
  );
}
