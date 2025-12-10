import { BodyShort, VStack } from "@navikt/ds-react";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  ferdigstiltTidspunkt: string;
  evalueringsDato: string;
}

export function AktivPlanDetailsSM({
  ferdigstiltTidspunkt,
  evalueringsDato,
}: Props) {
  return (
    <VStack gap="1">
      <BodyShort size="medium">
        Opprettet: {getFormattedDateString(ferdigstiltTidspunkt)}
      </BodyShort>

      <BodyShort size="medium">
        Dato for evaluering: {getFormattedDateString(evalueringsDato)}
      </BodyShort>
    </VStack>
  );
}
