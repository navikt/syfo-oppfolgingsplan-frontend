import { FilePdfIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";

interface Props {
  className?: string;
}

export function LastNedSomPdfButton({ className }: Props) {
  return (
    <Button
      variant="tertiary"
      icon={<FilePdfIcon />}
      iconPosition="right"
      className={className}
    >
      Last ned som PDF
    </Button>
  );
}
