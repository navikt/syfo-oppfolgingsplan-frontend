import { BodyLong, HelpText, HStack, Loader } from "@navikt/ds-react";
import {
  getFormattedDateAndTimeString,
  getFormattedTimeString,
} from "@/ui-helpers/dateAndTime";
import {
  isDateToday,
  isNotMoreThanOneHourAgo,
} from "@/utils/dateAndTime/dateUtils";

interface Props {
  isSavingUtkast: boolean;
  utkastSistLagretTidspunkt: string | null;
}

export default function UtkastLagringInfo({
  isSavingUtkast,
  utkastSistLagretTidspunkt,
}: Props) {
  if (isSavingUtkast) {
    return (
      <HStack gap="space-16" align="center">
        <BodyLong size="medium" className="text-ax-text-neutral-subtle">
          <span>Lagrer utkast...</span>
        </BodyLong>
        <Loader
          size="small"
          title="Lagrer utkast"
          variant="interaction"
          className="relative -top-px"
        />
      </HStack>
    );
  }

  if (utkastSistLagretTidspunkt) {
    const isToday = isDateToday(utkastSistLagretTidspunkt);
    const displaySeconds = isNotMoreThanOneHourAgo(utkastSistLagretTidspunkt);

    const sistLagretTidspunktFormatted = isToday
      ? `kl. ${getFormattedTimeString(utkastSistLagretTidspunkt, displaySeconds)}`
      : getFormattedDateAndTimeString(
          utkastSistLagretTidspunkt,
          displaySeconds,
        );

    return (
      <HStack gap="space-16" align="center">
        <BodyLong size="medium" className="text-ax-text-neutral-subtle">
          <span>Utkast sist lagret {sistLagretTidspunktFormatted}</span>
        </BodyLong>
        <HelpText className="relative -top-px">
          Dine endringer lagres som et utkast mens du skriver. Hvis du ønsker å
          jobbe videre med oppfølgingsplanen senere kan du velge «Avslutt og
          fortsett senere».
        </HelpText>
      </HStack>
    );
  }

  return null;
}
