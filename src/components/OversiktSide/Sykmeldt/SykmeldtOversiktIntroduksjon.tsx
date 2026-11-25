import { BodyLong, Link, VStack } from "@navikt/ds-react";
import TextContentBox from "@/components/layout/TextContentBox";

export function SykmeldtIntroduksjon() {
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
