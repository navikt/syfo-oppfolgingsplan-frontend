import { BodyLong } from "@navikt/ds-react";
import TextContentBox from "@/components/layout/TextContentBox";

interface Props {
  erITiltaksgruppe: boolean;
}

export default function OversiktSideIntroduksjon({ erITiltaksgruppe }: Props) {
  return (
    <TextContentBox>
      <BodyLong size="large" spacing>
        {erITiltaksgruppe
          ? "En god oppfølgingsplan gir dere felles retning og gjør det lettere å finne tilpasninger som fungerer."
          : "Oppfølgingsplanen er et verktøy som brukes i sykefraværsoppfølgingen. Du og den sykmeldte ansatte skal samarbeide om å finne løsninger slik at den ansatte kan komme tilbake i arbeid."}
      </BodyLong>
    </TextContentBox>
  );
}
