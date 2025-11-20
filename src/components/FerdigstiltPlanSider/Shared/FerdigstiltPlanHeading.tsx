import { Heading } from "@navikt/ds-react";

interface Props {
  employeeName: string;
}

export function FerdigstiltPlanHeading({ employeeName }: Props) {
  return (
    <Heading level="2" size="xlarge">
      Oppfølgingsplan for {employeeName}
    </Heading>
  );
}
