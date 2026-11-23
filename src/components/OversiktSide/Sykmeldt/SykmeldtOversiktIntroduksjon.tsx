import { BodyLong, Link, VStack } from "@navikt/ds-react";
import TextContentBox from "@/components/layout/TextContentBox";

export function SykmeldtTiltaksgruppeIntroduksjon() {
  return (
    <TextContentBox>
      <VStack gap="space-8" paddingBlock="space-0 space-16">
        <BodyLong>
          På denne siden finner du oppfølgingsplanene du og lederen din lager
          sammen. Som sykmeldt har du det som kalles{" "}
          <strong>medvirkningsplikt</strong>. Det innebærer at du tar ansvar for
          å komme frem til løsninger som kan gjøre det lettere å komme tilbake i
          jobb. Lederen din er den som har hovedansvaret, men du har et ansvar
          for å bidra.
        </BodyLong>
        <BodyLong>
          Er det vanskelig å snakke med lederen din, kan du ta kontakt med Nav
          ved å <Link href="https://www.nav.no/kontaktoss">skrive til oss</Link>{" "}
          eller på telefon 55 55 33 33.
        </BodyLong>
      </VStack>
    </TextContentBox>
  );
}

export function SykmeldtKontrollgruppeIntroduksjon() {
  return (
    <TextContentBox>
      <BodyLong size="large" className="mb-4">
        På denne siden finner du oppfølgingsplanene du og lederen din lager
        sammen. Lederen din er lovpålagt å lage oppfølgingsplanen, og dele den
        med fastlegen din innen fire ukers sykefravær.
      </BodyLong>
      <BodyLong size="large" spacing>
        Du har ansvar for å bidra med innhold til planen. Oppfølgingsplanen skal
        hjelpe deg tilbake i jobb på en trygg og tilpasset måte. For at planen
        skal bli best mulig tilpasset deg og din arbeidssituasjon, er det viktig
        at du snakker med lederen din om hva du trenger.
      </BodyLong>
    </TextContentBox>
  );
}
