import { Alert, BodyShort, VStack } from "@navikt/ds-react";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  nyligOprettet: boolean;
  ferdigstiltTidspunkt: string;
  evalueringsDato: string;
}

export function AktivPlanDetailsAG({
  nyligOprettet,
  ferdigstiltTidspunkt,
  evalueringsDato,
}: Props) {
  const evalueringsDatoInfo = (
    <BodyShort size="medium">
      Evalueringsdato: {getFormattedDateString(evalueringsDato)}
    </BodyShort>
  );

  return nyligOprettet ? (
    <VStack className="gap-8">
      <Alert variant="success" size="medium">
        Oppfølgingsplanen er ferdigstilt og delt med den ansatte.
      </Alert>

      {evalueringsDatoInfo}
    </VStack>
  ) : (
    <VStack className="gap-4">
      <BodyShort size="medium">
        Opprettet dato: {getFormattedDateString(ferdigstiltTidspunkt)}
      </BodyShort>

      {evalueringsDatoInfo}
    </VStack>
  );
}
