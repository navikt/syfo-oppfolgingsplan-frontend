import { VStack } from "@navikt/ds-react";
import { FerdigstiltPlanHeadingForAG } from "../FerdigstiltPlanHeadingForAG";
import { AktivPlanTopTagsForAG } from "./AktivPlanTopTagsForAG";

interface Props {
  employeeName: string;
}

export function AktivPlanHeadingAndTagsForAG({ employeeName }: Props) {
  return (
    <VStack gap="2">
      <FerdigstiltPlanHeadingForAG employeeName={employeeName} />

      <AktivPlanTopTagsForAG />
    </VStack>
  );
}
