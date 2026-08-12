import {
  BodyLong,
  Button,
  Checkbox,
  ErrorSummary,
  HStack,
  VStack,
} from "@navikt/ds-react";
// Flat imports are required because compound imports break with optimizePackageImports.
import {
  ExpansionCard,
  ExpansionCardContent,
  ExpansionCardHeader,
  ExpansionCardTitle,
} from "@navikt/ds-react/ExpansionCard";
import { List, ListItem } from "@navikt/ds-react/List";
import { useEffect, useRef, useState } from "react";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import useMeldUnntakAction from "./useMeldUnntakAction";

const BEKREFTELSE_CHECKBOX_ID = "meld-unntak-bekreftelse";

interface Props {
  ansattNavn: string;
  onSuccess: () => void;
}

export default function MeldUnntakForm({ ansattNavn, onSuccess }: Props) {
  const [erBekreftet, setErBekreftet] = useState(false);
  const [visValideringsfeil, setVisValideringsfeil] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const { error, isPending, meldUnntak } = useMeldUnntakAction();

  useEffect(() => {
    if (visValideringsfeil) {
      errorSummaryRef.current?.focus();
    }
  }, [visValideringsfeil]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!erBekreftet) {
      if (visValideringsfeil) {
        errorSummaryRef.current?.focus();
      } else {
        setVisValideringsfeil(true);
      }
      return;
    }

    meldUnntak(onSuccess);
  }

  function handleBekreftelseChange(event: React.ChangeEvent<HTMLInputElement>) {
    setErBekreftet(event.target.checked);

    if (event.target.checked) {
      setVisValideringsfeil(false);
    }
  }

  return (
    <ExpansionCard
      aria-label={`Unntak fra oppfølgingsplan for ${ansattNavn}`}
      data-color="neutral"
      size="small"
    >
      <ExpansionCardHeader>
        <ExpansionCardTitle as="h3" size="small">
          Det finnes noen unntak fra å lage oppfølgingsplan
        </ExpansionCardTitle>
      </ExpansionCardHeader>
      <ExpansionCardContent>
        <form onSubmit={handleSubmit} noValidate>
          <VStack gap="space-16">
            <VStack gap="space-8">
              <BodyLong>Disse kan for eksempel være:</BodyLong>

              <List>
                <ListItem>Den ansatte er for syk til å lage plan</ListItem>
                <ListItem>Den ansatte er snart tilbake i full jobb</ListItem>
                <ListItem>Arbeidsforholdet skal snart avsluttes</ListItem>
                <ListItem>
                  Det er ikke mulig å få kontakt med den ansatte
                </ListItem>
              </List>
            </VStack>

            {visValideringsfeil && (
              <ErrorSummary
                ref={errorSummaryRef}
                heading="Du må rette dette før du kan sende:"
              >
                <ErrorSummary.Item href={`#${BEKREFTELSE_CHECKBOX_ID}`}>
                  Du må bekrefte at en oppfølgingsplan ikke er nødvendig nå
                </ErrorSummary.Item>
              </ErrorSummary>
            )}

            <Checkbox
              id={BEKREFTELSE_CHECKBOX_ID}
              checked={erBekreftet}
              onChange={handleBekreftelseChange}
              error={visValideringsfeil}
              description="Unntakene følger av arbeidsmiljøloven § 4-6: Planen kan utelates «med mindre det er åpenbart unødvendig»."
            >
              Jeg bekrefter at en oppfølgingsplan ikke er nødvendig for{" "}
              {ansattNavn} slik situasjonen er nå.
            </Checkbox>

            <FetchErrorAlert error={error} />

            <HStack>
              <Button
                type="submit"
                variant="primary"
                data-color="neutral"
                size="small"
                loading={isPending}
              >
                Send til Nav og den ansatte
              </Button>
            </HStack>
          </VStack>
        </form>
      </ExpansionCardContent>
    </ExpansionCard>
  );
}
