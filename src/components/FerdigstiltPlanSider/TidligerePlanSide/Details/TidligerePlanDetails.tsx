import { BodyShort, VStack } from "@navikt/ds-react";
import {
  getFormattedDateAndTimeString,
  getFormattedDateString,
} from "@/ui-helpers/dateAndTime";

interface Props {
  ferdigstiltTidspunkt: string;
  evalueringsDato: string;
  deltMedLegeTidspunkt: string | null;
  deltMedVeilederTidspunkt: string | null;
}

export function TidligerePlanDetails({
  ferdigstiltTidspunkt,
  evalueringsDato,
  deltMedLegeTidspunkt,
  deltMedVeilederTidspunkt,
}: Props) {
  return (
    <VStack className="gap-4">
      <VStack gap="space-8">
        <BodyShort size="medium">
          Opprettet dato: {getFormattedDateString(ferdigstiltTidspunkt)}
        </BodyShort>

        <BodyShort size="medium">
          Evalueringsdato: {getFormattedDateString(evalueringsDato)}
        </BodyShort>
      </VStack>
      <VStack gap="space-8">
        {deltMedLegeTidspunkt && (
          <BodyShort size="medium">
            Planen ble sendt til fastlege{" "}
            {getFormattedDateAndTimeString(deltMedLegeTidspunkt)}.
          </BodyShort>
        )}

        {deltMedVeilederTidspunkt && (
          <BodyShort size="medium">
            Den ble sendt til Nav-veileder{" "}
            {getFormattedDateAndTimeString(deltMedVeilederTidspunkt)}.
          </BodyShort>
        )}
      </VStack>
    </VStack>
  );
}
