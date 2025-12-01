import { BodyShort, VStack } from "@navikt/ds-react";
import {
  getLocaleDateAndTimeString,
  getLocaleDateString,
} from "@/common/dateAndTime";

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
          Denne tidligere planen ble ferdigstilt og delt med den ansatte{" "}
          {getLocaleDateAndTimeString(ferdigstiltTidspunkt, "long")}.
        </BodyShort>

        {deltMedLegeTidspunkt && (
          <BodyShort size="medium">
            Den ble delt med fastlege{" "}
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

      <BodyShort size="medium">
        Evaluering av planen var planlagt{" "}
        {getLocaleDateString(evalueringsDato, "long")}.
      </BodyShort>
    </VStack>
  );
}
