import { Box } from "@navikt/ds-react";

export default function TextContentBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <Box className={`max-w-[670] ${className}`}>{children}</Box>;
}
