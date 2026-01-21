import { VStack } from "@navikt/ds-react";
import { FerdigstiltPlanHeading } from "../../Shared/FerdigstiltPlanHeading";
import { AktivPlanTopTags } from "./AktivPlanTopTags";

interface Props {
  employeeName: string;
}

export function AktivPlanHeadingAndTags({ employeeName }: Props) {
  return (
    <VStack gap="space-8">
      <FerdigstiltPlanHeading employeeName={employeeName} />
      <AktivPlanTopTags />
    </VStack>
  );
}
