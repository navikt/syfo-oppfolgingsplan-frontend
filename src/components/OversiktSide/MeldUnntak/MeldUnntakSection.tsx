"use client";

import {
  BodyLong,
  Button,
  Checkbox,
  ErrorSummary,
  LocalAlert,
  ReadMore,
  VStack,
} from "@navikt/ds-react";
// Subkomponenter importeres flatt fra subpath — compound-varianten
// (List.Item, LocalAlert.Header) brekker under Next sin optimizePackageImports.
import { List, ListItem } from "@navikt/ds-react/List";
import {
  LocalAlertCloseButton,
  LocalAlertContent,
  LocalAlertHeader,
  LocalAlertTitle,
} from "@navikt/ds-react/LocalAlert";
import { useParams } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { meldUnntaksvurderingServerAction } from "@/server/actions/meldUnntaksvurdering";
import type { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";

const BEKREFTELSE_CHECKBOX_ID = "meld-unntak-bekreftelse";

interface Props {
  /** Den ansattes navn, brukes i bekreftelsesteksten og kvitteringen. */
  ansattNavn: string;
}

/**
 * Lar arbeidsgiver melde at oppfølgingsplan ikke er aktuell nå
 * (unntaksvurdering). Vises kun når det ikke finnes plan eller utkast, og kun
 * for virksomheter i tiltaksgruppen — se NyPlanButtonHvisTomListe.
 *
 * Følger Figma-skissen «Behov for oppfølgingsplan vs. unntak», med
 * korrigeringen fra #891 om at sendeknappen aldri er disabled (validering
 * ved klikk med fokus til ErrorSummary). Tekstene lover sykmeldt-visningen
 * (#888) — trygt fordi hele flaten er gated bak big bang-toggelen og alt
 * AID-innhold lanseres samlet.
 */
export default function MeldUnntakSection({ ansattNavn }: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [erBekreftet, setErBekreftet] = useState(false);
  const [visValideringsfeil, setVisValideringsfeil] = useState(false);
  const [erSendt, setErSendt] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const [{ error }, meldUnntakAction, isPending] = useActionState(
    async (_previousState: FetchUpdateResult): Promise<FetchUpdateResult> => {
      const result = await meldUnntaksvurderingServerAction(narmesteLederId);

      if (result.error === null) {
        setErSendt(true);
      }

      return result;
    },
    { error: null },
  );

  useEffect(() => {
    if (visValideringsfeil) {
      errorSummaryRef.current?.focus();
    }
  }, [visValideringsfeil]);

  function lukkKvitteringOgNullstill() {
    setErSendt(false);
    setErBekreftet(false);
    setVisValideringsfeil(false);
  }

  if (erSendt) {
    return (
      <LocalAlert status="success" className="mb-8">
        <LocalAlertHeader>
          <LocalAlertTitle as="h3">
            Meldingen er sendt til Nav og den ansatte
          </LocalAlertTitle>
          <LocalAlertCloseButton onClick={lukkKvitteringOgNullstill} />
        </LocalAlertHeader>
        <LocalAlertContent>
          Nav har registrert at det ikke er aktuelt med en oppfølgingsplan for{" "}
          {ansattNavn} nå. Endrer situasjonen seg, kan det bli aktuelt at dere
          lager en plan.
        </LocalAlertContent>
      </LocalAlert>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!erBekreftet) {
      if (visValideringsfeil) {
        // Feilen vises allerede — flytt fokus dit på nytt.
        errorSummaryRef.current?.focus();
      } else {
        setVisValideringsfeil(true);
      }
      return;
    }

    startTransition(() => {
      meldUnntakAction();
    });
  }

  function handleBekreftelseChange(event: React.ChangeEvent<HTMLInputElement>) {
    setErBekreftet(event.target.checked);

    if (event.target.checked) {
      setVisValideringsfeil(false);
    }
  }

  return (
    <ReadMore
      header="Det finnes noen unntak fra å lage oppfølgingsplan"
      className="mb-8"
    >
      <form onSubmit={handleSubmit} noValidate>
        <VStack gap="space-16">
          <div>
            <BodyLong>Disse kan for eksempel være:</BodyLong>

            <List>
              <ListItem>Den ansatte er for syk til å lage plan</ListItem>
              <ListItem>Den ansatte er snart tilbake i full jobb</ListItem>
              <ListItem>Arbeidsforholdet skal snart avsluttes</ListItem>
              <ListItem>
                Det er ikke mulig å få kontakt med den ansatte
              </ListItem>
            </List>
          </div>

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

          <Button
            type="submit"
            variant="primary-neutral"
            size="small"
            loading={isPending}
            className="w-fit"
          >
            Send til Nav og den ansatte
          </Button>
        </VStack>
      </form>
    </ReadMore>
  );
}
