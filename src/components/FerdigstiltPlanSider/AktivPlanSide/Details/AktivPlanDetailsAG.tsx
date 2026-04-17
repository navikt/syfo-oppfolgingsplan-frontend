import { Alert, BodyShort, VStack } from "@navikt/ds-react";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";
import { StillingsInfo } from "../../Shared/StillingsInfo";

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

  return nyligOprettet ? (
    <VStack gap="space-8">
      <Alert variant="success" size="medium">
        Oppfølgingsplanen er ferdigstilt og delt med den ansatte.
      </Alert>

      {evalueringsDatoInfo}
      <StillingsInfo
        stillingstittel={stillingstittel}
        stillingsprosent={stillingsprosent}
        orgName={orgName}
      />
    </VStack>
  ) : (
    <VStack gap="space-4">
      <BodyShort size="medium">
        Opprettet dato: {getFormattedDateString(ferdigstiltTidspunkt)}
      </BodyShort>

      {evalueringsDatoInfo}
      <StillingsInfo
        stillingstittel={stillingstittel}
        stillingsprosent={stillingsprosent}
        orgName={orgName}
      />
    </VStack>
  );
}
