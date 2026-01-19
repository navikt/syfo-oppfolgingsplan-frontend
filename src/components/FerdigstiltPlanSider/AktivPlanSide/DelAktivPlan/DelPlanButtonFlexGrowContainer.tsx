import { Box } from "@navikt/ds-react";

export function DelPlanButtonFlexGrowContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box flexGrow="1" flexShrink="1" flexBasis="auto" className="max-w-56">
      {children}
    </Box>
  );
}
