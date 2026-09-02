import { ClipboardCheckmarkFillIcon, HandHeartIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Heading,
  Link,
  LinkCard,
  Tag,
  VStack,
} from "@navikt/ds-react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "@navikt/ds-react/InfoCard";
import {
  LinkCardAnchor,
  LinkCardDescription,
  LinkCardFooter,
  LinkCardIcon,
  LinkCardTitle,
} from "@navikt/ds-react/LinkCard";
import { List, ListItem } from "@navikt/ds-react/List";

const SAMTALEGUIDE_URL =
  "https://idebanken-xp7prod.enonic.cloud/headless/idebanken/master/_/attachment/inline/7f189117-0243-43b4-9c56-52f39f575c36:9eafeb718fbe6f2bc74cb45f1858b3411394d802/Samtaleguide%20med%20sp%C3%B8rsm%C3%A5l%20-%20dobbeltsidig%20A4.pdf";

export type ForberedelseTilSamtaleVariant = "standard" | "gjeldende-unntak";

const forberedelseInnhold = {
  standard: {
    title: "Få hjelp med forberedelsene til møtet om oppfølgingsplan",
    description:
      "Idebanken har gode råd og verktøy som kan hjelpe deg å vite hva du vil si når du og lederen din lager oppfølgingsplan sammen. Målet er å finne ut hva som kan gjøre det lettere for deg å komme tilbake i jobb.",
    visIkon: false,
    tagColor: "meta-purple" as const,
  },
  "gjeldende-unntak": {
    title: "Lag et forberedelsesskjema til samtalen",
    description:
      "Et forberedelsesskjema hjelper deg å tenke gjennom hva du vil si til lederen din. Idebanken har gode råd og verktøy for å forberede deg til samtalen om sykefravær.",
    visIkon: true,
    tagColor: "neutral" as const,
  },
} satisfies Record<
  ForberedelseTilSamtaleVariant,
  {
    title: string;
    description: string;
    visIkon: boolean;
    tagColor: "meta-purple" | "neutral";
  }
>;

export function DetteKanDuBidraMed() {
  return (
    <InfoCard data-color="info" className="mb-8">
      <InfoCardHeader icon={<HandHeartIcon aria-hidden />}>
        <InfoCardTitle as="h3">Dette kan du bidra med</InfoCardTitle>
      </InfoCardHeader>
      <InfoCardContent>
        <VStack gap="space-16">
          <List>
            <ListItem>
              Ha kontakt med og delta i møter med lederen din.
            </ListItem>
            <ListItem>
              Si om det er enkelte arbeidsoppgaver du klarer å gjennomføre nå.
            </ListItem>
            <ListItem>
              Vær med på å lage og oppdatere oppfølgingsplanen.
            </ListItem>
            <ListItem>
              Foreslå tilrettelegging som kan fungere for deg.
            </ListItem>
            <ListItem>
              Prøv ut tiltakene som du og lederen din kommer frem til, eller som
              Nav foreslår.
            </ListItem>
          </List>
          <BodyLong>
            Du trenger ikke forklare hvorfor du er syk. Det holder å si hva som
            er mulig å få til, slik at lederen din kan legge til rette for deg.
          </BodyLong>
          <BodyLong>
            Er det vanskelig å snakke med lederen din, kan du ta kontakt med Nav
            ved å{" "}
            <Link href="https://www.nav.no/kontaktoss">skrive til oss</Link>{" "}
            eller på telefon 55 55 33 33.
          </BodyLong>
        </VStack>
      </InfoCardContent>
    </InfoCard>
  );
}

export function ForberedelseTilSamtale({
  variant,
}: {
  variant: ForberedelseTilSamtaleVariant;
}) {
  const { title, description, visIkon, tagColor } =
    forberedelseInnhold[variant];

  return (
    <section aria-labelledby="forberedelse-til-samtale" className="mb-8">
      <Heading id="forberedelse-til-samtale" level="3" size="medium" spacing>
        Forbered deg til samtalen
      </Heading>
      <LinkCard as="article">
        {visIkon && (
          <LinkCardIcon>
            <ClipboardCheckmarkFillIcon aria-hidden />
          </LinkCardIcon>
        )}
        <LinkCardTitle as="h4">
          <LinkCardAnchor asChild>
            <a href={SAMTALEGUIDE_URL}>{title}</a>
          </LinkCardAnchor>
        </LinkCardTitle>
        <LinkCardDescription>
          <BodyLong>{description}</BodyLong>
        </LinkCardDescription>
        <LinkCardFooter>
          <Tag data-color={tagColor} variant="moderate" size="small">
            idebanken.org
          </Tag>
        </LinkCardFooter>
      </LinkCard>
    </section>
  );
}
