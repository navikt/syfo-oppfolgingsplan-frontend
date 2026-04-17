import { Alert, BodyShort, VStack } from "@navikt/ds-react";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  nyligOprettet: boolean;
  ferdigstiltTidspunkt: string;
  evalueringsDato: string;
  stillingstittel: string | null;
  stillingsprosent: number | null;
  orgName: string;
}

export function AktivPlanDetailsAG({
  nyligOprettet,
  ferdigstiltTidspunkt,
  evalueringsDato,
  stillingstittel,
  stillingsprosent,
  orgName,
}: Props) {
  const evalueringsDatoInfo = (
    <BodyShort size="medium">
      Evalueringsdato: {getFormattedDateString(evalueringsDato)}
    </BodyShort>
  );

  const stillingsInfo = stillingstittel ? (
    <BodyShort size="medium">
      Stilling: {stillingstittel} i {orgName}
      {stillingsprosent != null && ` i ${stillingsprosent}% stilling`}
    </BodyShort>
  ) : null;

  return nyligOprettet ? (
    <VStack gap="space-8">
      <Alert variant="success" size="medium">
        Oppfølgingsplanen er ferdigstilt og delt med den ansatte.
      </Alert>

      {evalueringsDatoInfo}
      {stillingsInfo}
    </VStack>
  ) : (
    <VStack gap="space-4">
      <BodyShort size="medium">
        Opprettet dato: {getFormattedDateString(ferdigstiltTidspunkt)}
      </BodyShort>

      {evalueringsDatoInfo}
      {stillingsInfo}
    </VStack>
  );
}
