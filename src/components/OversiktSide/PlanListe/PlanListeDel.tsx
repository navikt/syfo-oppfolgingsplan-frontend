import { Heading, VStack } from "@navikt/ds-react";

interface Props {
  heading: string;
  children: React.ReactNode;
}

export default function PlanListeDel({ heading, children }: Props) {
  return (
    <VStack className="mb-8">
      <Heading level="3" size="medium" spacing>
        {heading}
      </Heading>

      {children}
    </VStack>
  );
}
