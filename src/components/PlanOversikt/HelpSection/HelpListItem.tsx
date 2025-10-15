import { Box, Heading } from "@navikt/ds-react";
import Image from "next/image";

interface Props {
  illustrationSrc: string;
  illustrationAlt: string;
  title: string;
  children: React.ReactNode;
}

export default function HelpListItem({
  illustrationSrc,
  illustrationAlt,
  title,
  children,
}: Props) {
  return (
    <Box className="flex gap-12 mb-8">
      <Box className="flex-shrink-0">
        <Image
          src={illustrationSrc}
          alt={illustrationAlt}
          width={64}
          height={64}
        />
      </Box>
      <Box>
        <Heading level="3" size="small" spacing>
          {title}
        </Heading>
        {children}
      </Box>
    </Box>
  );
}
