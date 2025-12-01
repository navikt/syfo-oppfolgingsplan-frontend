import { Alert, BodyLong, Heading } from "@navikt/ds-react";

interface Props {
  className?: string;
}

export default function NarDuFerdigstillerPlanenAlert({ className }: Props) {
  return (
    <Alert variant="info" className={className}>
      <Heading level="3" size="small" spacing>
        Når du ferdigstiller planen
      </Heading>

      <BodyLong>
        Når du velger å ferdigstille planen deles den med den ansatte, og de kan
        finne den ved å logge seg på nav.no. Du som arbeidsgiver vil også finne
        planen under Oppfølgingsplaner på nav.no. Hvis du ikke er klar til å
        dele planen med den ansatte enda, så kan du avslutte og fortsette
        senere. Det du har skrevet finner du igjen i et utkast under
        oppfølgingsplaner for den ansatte.
      </BodyLong>
    </Alert>
  );
}
