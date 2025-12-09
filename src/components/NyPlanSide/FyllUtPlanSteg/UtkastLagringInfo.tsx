import { BodyLong, HStack, HelpText, Loader } from "@navikt/ds-react";
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
      <HStack gap="4" align="center">
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
      : getFormattedDateAndTimeString(utkastSistLagretTidspunkt);

    return (
      <HStack gap="4" align="center">
        <BodyLong size="medium" className="text-ax-text-neutral-subtle">
          <span>Utkast sist lagret {sistLagretTidspunktFormatted}</span>
        </BodyLong>

        <HelpText className="relative -top-px">
          Dine endringer lagres som et utkast mens du skriver. Du finner igjen
          utkastet på siden med oppfølgingsplaner for den ansatte. Klikk på
          «Avslutt og fortsett senere» for å avslutte for nå og gå til den
          siden. Derfra kan du klikke på utkastet for å fortsette skrivingen.
        </HelpText>
      </HStack>
    );
  }

  return null;
}
