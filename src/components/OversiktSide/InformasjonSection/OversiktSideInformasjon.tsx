import { BodyLong, Heading, Link } from "@navikt/ds-react";
import {
  CHAT_BUBBLE_SVG,
  CLIPBOARD_SVG,
  LETTER_OPENED_SVG,
  PENCIL_SVG,
  STEPPER_SVG,
} from "@/common/publicAssets";
import InformasjonListItem from "./InformasjonListItem";

export default function OversiktSideInformasjon() {
  return (
    <section>
      <Heading level="3" size="medium" className="mb-8">
        Hjelp til å lage og bruke oppfølgingsplaner
      </Heading>

      <InformasjonListItem
        illustrationSrc={CHAT_BUBBLE_SVG}
        heading="Involver medarbeideren din!"
      >
        <BodyLong className="mb-4">
          I utgangspunktet skal du og medarbeideren din utarbeide
          oppfølgingsplanen sammen. Medarbeideren har også en plikt til å delta
          i dette arbeidet. Før du lager oppfølgingsplanen bør dere snakke
          sammen og diskutere spørsmålene i planen.
        </BodyLong>
        <BodyLong>
          Bruk{" "}
          <Link
            href="https://www.nav.no/arbeidsgiver/samtalestotte-arbeidsgiver"
            target="_blank"
          >
            samtalestøtten vår (åpner i ny fane)
          </Link>{" "}
          for å få gode tips og veiledning til å gjennomføre en slik samtale.
        </BodyLong>
      </InformasjonListItem>

      <InformasjonListItem
        illustrationSrc={PENCIL_SVG}
        heading="Foreslå tilpasninger og bli enige om oppfølging"
      >
        <BodyLong size="medium">
          Selv om medarbeideren din ikke kan gjøre den vanlige jobben sin, er
          det ofte mulig å gjøre andre oppgaver en periode eller gjøre
          tilpasninger i arbeidstid eller mengde for at det skal gå an å jobbe.
          Finn ut sammen hva dere har lyst til å prøve ut, og bli enige om hvor
          lenge dere skal teste tilpasningene.
        </BodyLong>
      </InformasjonListItem>

      <InformasjonListItem
        illustrationSrc={LETTER_OPENED_SVG}
        heading="Del oppfølgingsplanen med legen og Nav når som helst"
      >
        <BodyLong size="medium" className="mb-4">
          Du kan når som helst dele en oppfølgingsplan med medarbeiderens
          fastlege og Nav. Du skal dele oppfølgingsplanen med fastlegen senest
          når sykefraværet har vart i 4 uker.
        </BodyLong>
        <BodyLong size="medium">
          Du vil bli spurt om du ønsker å dele oppfølgingsplanen etter at du har
          opprettet den. Du kan også komme tilbake og dele en opprettet
          oppfølgingsplan senere.
        </BodyLong>
      </InformasjonListItem>

      <InformasjonListItem
        illustrationSrc={STEPPER_SVG}
        heading="Oppdater planen underveis"
      >
        <BodyLong className="mb-4">
          Du kan bruke en tidligere oppfølgingsplan som utgangspunkt når du
          starter å lage en ny plan. Slik kan du holde planen oppdatert og gjøre
          små eller store endringer.
        </BodyLong>
      </InformasjonListItem>

      <InformasjonListItem
        illustrationSrc={CLIPBOARD_SVG}
        heading="Last ned en oppfølgingsplan som PDF"
      >
        <BodyLong>
          Hvis du ønsker å lagre en oppfølgingsplan i eget system, kan du laste
          ned en PDF-versjon av planen.
        </BodyLong>
      </InformasjonListItem>
    </section>
  );
}
