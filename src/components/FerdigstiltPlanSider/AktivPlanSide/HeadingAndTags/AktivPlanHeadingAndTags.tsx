import { VStack } from "@navikt/ds-react";
import { FerdigstiltPlanHeading } from "../../Shared/FerdigstiltPlanHeading";
import { AktivPlanTopTags } from "./AktivPlanTopTags";

interface Props {
  employeeName: string;
}

export function AktivPlanHeadingAndTags({ employeeName }: Props) {
  return (
    <VStack gap="2">
      <FerdigstiltPlanHeading employeeName={employeeName} />

      <AktivPlanTopTags />
    </VStack>
  );
}
