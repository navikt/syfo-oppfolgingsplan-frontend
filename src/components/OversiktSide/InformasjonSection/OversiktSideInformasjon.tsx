import { BodyLong, Link } from "@navikt/ds-react";
import { SAMTALEGUIDE_URL } from "@/common/app-config";
import {
  CHAT_BUBBLE_SVG,
  LETTER_OPENED_SVG,
  PENCIL_SVG,
  STEPPER_SVG,
} from "@/common/publicAssets";
import InformasjonListItem from "./InformasjonListItem";

export default function OversiktSideInformasjon() {
  return (
    <section aria-label="Slik bruker dere oppfølgingsplanen">
      <InformasjonListItem
        illustrationSrc={CHAT_BUBBLE_SVG}
        heading="Samarbeid med den ansatte"
      >
        <BodyLong spacing>
          Det beste er at du og den ansatte lager en oppfølgingsplan sammen. Du
          har ansvaret samtidig som den ansatte også har et eget ansvar til å
          bidra.
        </BodyLong>
        <BodyLong>
          Bruk{" "}
          <Link href={SAMTALEGUIDE_URL} target="_blank" inlineText>
            samtaleguiden (åpner i ny fane)
          </Link>{" "}
          for å få gode tips og veiledning til samtalen med den ansatte.
        </BodyLong>
      </InformasjonListItem>

      <InformasjonListItem
        illustrationSrc={PENCIL_SVG}
        heading="Bli enige om hvordan dere skal ha kontakt underveis"
      >
        <BodyLong>
          Dere trenger ikke finne den perfekte løsningen med en gang. Ha dialog
          om hva som fungerer. Jevn kontakt har vist seg å bidra til at det blir
          lettere å komme tilbake i jobb.
        </BodyLong>
      </InformasjonListItem>

      <InformasjonListItem
        illustrationSrc={LETTER_OPENED_SVG}
        heading="Del planen med fastlegen og Nav"
      >
        <BodyLong>
          Del planen med fastlegen innen 4 uker. Du kan sende den til Nav når
          som helst i forløpet. Hensikten er å gi et bilde av arbeidssituasjonen
          til den som er sykmeldt.
        </BodyLong>
      </InformasjonListItem>

      <InformasjonListItem
        illustrationSrc={STEPPER_SVG}
        heading="Oppdater planen underveis"
      >
        <BodyLong>
          Situasjonen til den som er sykmeldt kan endre seg og det kan planen
          også. Husk å oppdatere planen når det skjer endringer i sykefraværet.
        </BodyLong>
      </InformasjonListItem>
    </section>
  );
}
