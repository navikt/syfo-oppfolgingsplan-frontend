import { Alert, BodyShort, VStack } from "@navikt/ds-react";
import {
  getLocaleDateAndTimeString,
  getLocaleDateString,
} from "@/ui-helpers/dateAndTime";
import { isDateInPast } from "@/utils/dateUtils";

interface Props {
  nyligOprettet: boolean;
  ferdigstiltTidspunkt: Date;
  evalueringsDato: Date;
}

export function AktivPlanDetails({
  nyligOprettet,
  ferdigstiltTidspunkt,
  evalueringsDato,
}: Props) {
  const evalueringsDatoInfo = (
    <BodyShort size="medium">
      Evalueringsdato: {getLocaleDateString(evalueringsDato, "long")}
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
        Opprettet dato: {getLocaleDateString(ferdigstiltTidspunkt, "long")}
      </BodyShort>

      {evalueringsDatoInfo}
    </VStack>
  );
}
