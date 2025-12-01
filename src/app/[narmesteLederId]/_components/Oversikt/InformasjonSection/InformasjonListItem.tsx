import Image from "next/image";
import { Box, Heading } from "@navikt/ds-react";

interface Props {
  illustrationSrc: string;
  heading: string;
  children: React.ReactNode;
}

export default function InformasjonListItem({
  illustrationSrc,
  heading,
  children,
}: Props) {
  return (
    <Box className="flex gap-12 mb-8">
      <Box className="flex-shrink-0">
        <Image src={illustrationSrc} alt="" width={64} height={64} />
      </Box>
      <Box>
        <Heading level="3" size="small" spacing>
          {heading}
        </Heading>
        {children}
      </Box>
    </Box>
  );
}
