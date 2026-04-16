import { BodyShort, VStack } from "@navikt/ds-react";
import { getFormattedDateString } from "@/ui-helpers/dateAndTime";

interface Props {
  ferdigstiltTidspunkt: string;
  evalueringsDato: string;
  stillingstittel?: string | null;
  stillingsprosent?: number | null;
  orgName: string;
}

export function AktivPlanDetailsSM({
  ferdigstiltTidspunkt,
  evalueringsDato,
  stillingstittel,
  stillingsprosent,
  orgName,
}: Props) {
  return (
    <VStack gap="space-4">
      <BodyShort size="medium">
        Opprettet: {getFormattedDateString(ferdigstiltTidspunkt)}
      </BodyShort>
      <BodyShort size="medium">
        Dato for evaluering: {getFormattedDateString(evalueringsDato)}
      </BodyShort>
      {stillingstittel && (
        <BodyShort size="medium">
          Stilling: {stillingstittel} i {orgName}
          {stillingsprosent != null && ` i ${stillingsprosent}% stilling`}
        </BodyShort>
      )}
    </VStack>
  );
}
