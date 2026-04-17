import { BodyShort, VStack } from "@navikt/ds-react";
import {
  getFormattedDateAndTimeString,
  getFormattedDateString,
} from "@/ui-helpers/dateAndTime";
import { StillingsInfo } from "../../Shared/StillingsInfo";

interface Props {
  ferdigstiltTidspunkt: string;
  evalueringsDato: string;
  deltMedLegeTidspunkt: string | null;
  deltMedVeilederTidspunkt: string | null;
  stillingstittel: string | null;
  stillingsprosent: number | null;
  orgName: string;
}

export function TidligerePlanDetails({
  ferdigstiltTidspunkt,
  evalueringsDato,
  deltMedLegeTidspunkt,
  deltMedVeilederTidspunkt,
  stillingstittel,
  stillingsprosent,
  orgName,
}: Props) {
  return (
    <VStack gap="space-4">
      <VStack gap="space-8">
        <BodyShort size="medium">
          Opprettet dato: {getFormattedDateString(ferdigstiltTidspunkt)}
        </BodyShort>

        <BodyShort size="medium">
          Evalueringsdato: {getFormattedDateString(evalueringsDato)}
        </BodyShort>

        <StillingsInfo
          stillingstittel={stillingstittel}
          stillingsprosent={stillingsprosent}
          orgName={orgName}
        />
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
