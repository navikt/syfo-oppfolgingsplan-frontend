import { BodyShort, VStack } from "@navikt/ds-react";
import {
  getLocaleDateAndTimeString,
  getLocaleDateString,
} from "@/ui-helpers/dateAndTime";

interface Props {
  ferdigstiltTidspunkt: Date;
  evalueringsDato: Date;
  deltMedLegeTidspunkt: Date | null;
  deltMedVeilederTidspunkt: Date | null;
}

export function TidligerePlanDetails({
  ferdigstiltTidspunkt,
  evalueringsDato,
  deltMedLegeTidspunkt,
  deltMedVeilederTidspunkt,
}: Props) {
  return (
    <VStack className="gap-4">
      <VStack gap="2">
        <BodyShort size="medium">
          Opprettet dato: {getLocaleDateString(ferdigstiltTidspunkt, "long")}
        </BodyShort>

        <BodyShort size="medium">
          Evalueringsdato: {getLocaleDateString(evalueringsDato, "long")}
        </BodyShort>
      </VStack>

      <VStack gap="2">
        {deltMedLegeTidspunkt && (
          <BodyShort size="medium">
            Planen ble delt med fastlege{" "}
            {getLocaleDateAndTimeString(deltMedLegeTidspunkt, "long")}.
          </BodyShort>
        )}

        {deltMedVeilederTidspunkt && (
          <BodyShort size="medium">
            Den ble delt med Nav-veileder{" "}
            {getLocaleDateAndTimeString(deltMedVeilederTidspunkt, "long")}.
          </BodyShort>
        )}
      </VStack>
    </VStack>
  );
}
