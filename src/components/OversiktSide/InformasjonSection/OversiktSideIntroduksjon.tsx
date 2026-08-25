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

export function OversiktSideIntroduksjonForSykmeldt({
  erITiltaksgruppe,
}: Props) {
  return (
    <TextContentBox>
      {erITiltaksgruppe ? (
        <BodyLong size="large" spacing>
          På denne siden finner du oppfølgingsplanene du og lederen din lager
          sammen. Som sykmeldt har du det som kalles{" "}
          <strong>medvirkningsplikt</strong>. Det innebærer at du har ansvar for
          å komme frem til løsninger som kan gjøre det lettere å komme tilbake i
          jobb. Lederen din har hovedansvaret, men du har ansvar for å bidra.
        </BodyLong>
      ) : (
        <>
          <BodyLong size="large" className="mb-4">
            På denne siden finner du oppfølgingsplanene du og lederen din lager
            sammen. Lederen din er lovpålagt å lage oppfølgingsplanen, og dele
            den med fastlegen din innen fire ukers sykefravær.
          </BodyLong>
          <BodyLong size="large" spacing>
            Du har ansvar for å bidra med innhold til planen. Oppfølgingsplanen
            skal hjelpe deg tilbake i jobb på en trygg og tilpasset måte. For at
            planen skal bli best mulig tilpasset deg og din arbeidssituasjon, er
            det viktig at du snakker med lederen din om hva du trenger.
          </BodyLong>
        </>
      )}
    </TextContentBox>
  );
}
