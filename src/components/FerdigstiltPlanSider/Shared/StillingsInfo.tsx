import { BodyShort } from "@navikt/ds-react";

interface Props {
  stillingstittel: string | null;
  stillingsprosent: number | null;
  orgName: string;
}

export function StillingsInfo({
  stillingstittel,
  stillingsprosent,
  orgName,
}: Props) {
  if (!stillingstittel) return null;

  return (
    <BodyShort size="medium">
      Stilling: {stillingstittel} i {orgName}
      {stillingsprosent != null && ` i ${stillingsprosent}% stilling`}
    </BodyShort>
  );
}
