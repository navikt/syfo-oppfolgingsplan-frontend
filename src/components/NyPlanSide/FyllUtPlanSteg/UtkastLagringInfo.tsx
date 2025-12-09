import { BodyLong, HStack, HelpText, Loader } from "@navikt/ds-react";

interface Props {
  isSavingUtkast: boolean;
  utkastSistLagretTidspunkt: Date | null;
}

export default function UtkastLagringInfo({
  isSavingUtkast,
  utkastSistLagretTidspunkt,
}: Props) {
  if (!isSavingUtkast && !utkastSistLagretTidspunkt) {
    return null;
  }

  return isSavingUtkast ? (
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
  ) : (
    <HStack gap="4" align="center">
      <BodyLong size="medium" className="text-ax-text-neutral-subtle">
        <span>
          Utkast sist lagret kl.{" "}
          {utkastSistLagretTidspunkt?.toLocaleTimeString("no-NB", {
            timeZone: "Europe/Oslo",
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
