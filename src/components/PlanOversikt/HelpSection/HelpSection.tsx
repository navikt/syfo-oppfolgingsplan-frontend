import { BodyLong, Link } from "@navikt/ds-react";
import HelpListItem from "./HelpListItem";

const helpListItemContents = [
  {
    illustrationSrc: "/illustrations/chat-double-bubble.svg",
    illustrationAlt: "Chat icon",
    title: "Involver den ansatte",
    content: (
      <>
        <BodyLong className="mb-4">
          En oppfølgingsplan skal i utgangspunktet utarbeides i samarbeid med
          den ansatte. Som medlem i folketrygden har den ansatte også en plikt
          til å delta i dette arbeidet. Før du lager en oppfølginsplan bør du
          derfor ta en prat med den sykmeldte ansatte og diskutere spørsmålene i
          oppfølgingsplanen.
        </BodyLong>
        <BodyLong>
          Bruk{" "}
          <Link
            href="https://www.nav.no/arbeidsgiver/samtalestotte-arbeidsgiver"
            target="_blank"
          >
            samtalestøtten vår (åpner i ny fane)
          </Link>{" "}
          for å få gode tips og veiledning til å gjennomføre en slik prat.
        </BodyLong>
      </>
    ),
  },
  {
    illustrationSrc: "/illustrations/pencil.svg",
    illustrationAlt: "Pencil",
    title: "Foreslå tilpasninger og bli enige om oppfølging",
    content: (
      <BodyLong size="medium">
        Selv om den ansatte ikke kan gjøre sin vanlige jobb, er det ofte mulig å
        gjøre andre oppgaver en periode eller gjøre tilpasninger i arbeidstid
        eller mengde for at det skal gå an å jobbe. Finn ut sammen hva dere har
        lyst til å prøve ut, og bli enige om hvor lenge dere skal teste
        tilpasningene.
      </BodyLong>
    ),
  },
  {
    illustrationSrc: "/illustrations/letter-opened.svg",
    illustrationAlt: "Share",
    title: "Del oppfølgingsplanen med legen og med Nav når som helst",
    content: (
      <>
        <BodyLong size="medium" className="mb-4">
          En opprettet oppfølgingsplan kan når som helst deles med den ansattes
          fastlege og med Nav. Oppfølgingsplanen skal deles med fastlegen senest
          når sykefraværet har vart i 4 uker. Planen kan deles med Nav når som
          helst, og skal deles senest før et dialogmøte, eller når
          Nav-veilederen ber om det.
        </BodyLong>
        <BodyLong size="medium">
          Du vil bli spurt om du ønsker å dele oppfølgingsplanen etter at du har
          opprettet den. Du kan også komme tilbake og dele en opprettet
          oppfølgingsplan senere.
        </BodyLong>
      </>
    ),
  },
  {
    illustrationSrc: "/illustrations/stepper.svg",
    illustrationAlt: "Handshake",
    title: "Oppdater planen og be om påminnelse",
    content: (
      <>
        <BodyLong className="mb-4">
          Du kan bruke en tidligere oppfølgingsplan som utgangspunkt når du
          starter å lager en ny plan. Slik kan du holde en plan oppdatert og
          gjøre store eller små endringer.
        </BodyLong>
        <BodyLong>
          Du kan også be om å få en påminnelse om å vurdere å oppdatere
          oppfølgingsplanen på et tidspunkt du angir.
        </BodyLong>
      </>
    ),
  },
  {
    illustrationSrc: "/illustrations/clipboard.svg",
    illustrationAlt: "Pencil",
    title: "Last ned en oppfølgingsplan som PDF",
    content: (
      <>
        <BodyLong>
          Dersom du ønsker å lagre en oppfølgingsplan i eget system kan du laste
          ned en PDF-versjon av planen.
        </BodyLong>
      </>
    ),
  },
];

export default function HelpSection() {
  return (
    <section className="mt-8">
      {helpListItemContents.map((item, index) => (
        <HelpListItem
          key={index}
          illustrationSrc={item.illustrationSrc}
          illustrationAlt={item.illustrationAlt}
          title={item.title}
        >
          {item.content}
        </HelpListItem>
      ))}

      {/* <Alert variant="info" className="mb-8">
        <BodyLong>
          Oppfølgingsplaner som opprettes i denne løsningen blir ikke sendt til
          Altinn.
        </BodyLong>
      </Alert> */}
    </section>
  );
}
