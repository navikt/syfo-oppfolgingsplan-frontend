import { BodyLong, HStack, HelpText } from "@navikt/ds-react";

interface Props {
  isSavingUtkast: boolean;
  sistLagretUtkastTidspunkt: Date | null;
}

export default function UtkastSistLagretInfo({
  isSavingUtkast,
  sistLagretUtkastTidspunkt,
}: Props) {
  return isSavingUtkast ? (
    <BodyLong size="medium" className="text-ax-text-neutral-subtle">
      <span>Lagrer utkast...</span>
    </BodyLong>
  ) : (
    <HStack gap="4" align="center">
      <BodyLong size="medium" className="text-ax-text-neutral-subtle">
        <span>
          Utkast sist lagret kl.{" "}
          {sistLagretUtkastTidspunkt?.toLocaleTimeString("no-NB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </BodyLong>

      <HelpText className="relative -top-px">
        Dine endringer lagres som et utkast mens du skriver. Du finner igjen
        utkastet på siden med oppfølgingsplaner for den ansatte. Klikk på
        «Avslutt og fortsett senere» for å avslutte for nå og gå til den siden.
        Derfra kan du klikke på utkastet for å fortsette skrivingen.
      </HelpText>
    </HStack>
  );
}
