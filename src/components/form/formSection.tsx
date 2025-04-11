import { BodyLong, Box, Heading, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export const FormSection = ({ title, description, children }: Props) => {
  return (
    <div>
      <Heading size="large" level="2" spacing>
        {title}
      </Heading>
      <BodyLong spacing>{description}</BodyLong>
      <Box
        padding="4"
        background="bg-subtle"
        borderColor="border-default"
        borderWidth="1"
        borderRadius="medium"
      >
        <VStack gap="6">{children}</VStack>
      </Box>
    </div>
  );
};
