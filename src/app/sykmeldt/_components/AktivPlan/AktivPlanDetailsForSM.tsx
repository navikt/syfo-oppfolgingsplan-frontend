import { BodyShort, VStack } from "@navikt/ds-react";
import { getLocaleDateString } from "@/common/dateAndTime";

interface Props {
  ferdigstiltTidspunkt: Date;
  evalueringsDato: Date;
}

export function AktivPlanDetailsForSM({
  ferdigstiltTidspunkt,
  evalueringsDato,
}: Props) {
  return (
    <VStack gap="1">
      <BodyShort size="medium">
        Opprettet: {getLocaleDateString(ferdigstiltTidspunkt, "long")}
      </BodyShort>

      <BodyShort size="medium">
        Dato for evaluering: {getLocaleDateString(evalueringsDato, "long")}
      </BodyShort>
    </VStack>
  );
}
