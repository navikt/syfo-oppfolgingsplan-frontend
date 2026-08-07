"use client";

import {
  BodyLong,
  Button,
  Checkbox,
  ErrorSummary,
  ExpansionCard,
  LocalAlert,
  VStack,
} from "@navikt/ds-react";
// Subkomponenter importeres flatt fra subpath — compound-varianten
// (LocalAlert.Header) brekker under Next sin optimizePackageImports.
import {
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

/**
 * Lar arbeidsgiver melde at oppfølgingsplan ikke er aktuell nå
 * (unntaksvurdering). Vises kun når det ikke finnes plan eller utkast, og kun
 * for virksomheter i tiltaksgruppen — se NyPlanButtonHvisTomListe.
 *
 * Sendeknappen er aldri disabled: validering skjer ved klikk, med fokus til
 * ErrorSummary (Aksel fraråder deaktiverte knapper).
 */
export default function MeldUnntakSection() {
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

  if (erSendt) {
    return (
      <LocalAlert status="success" className="mb-8">
        <LocalAlertHeader>
          <LocalAlertTitle as="h3">Vurderingen er registrert</LocalAlertTitle>
        </LocalAlertHeader>
        <LocalAlertContent>
          Du har meldt at oppfølgingsplan ikke er aktuell nå. Du kan når som
          helst lage en oppfølgingsplan hvis situasjonen endrer seg.
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
    <ExpansionCard
      aria-label="Oppfølgingsplan er ikke aktuell nå"
      size="small"
      className="mb-8"
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title as="h3" size="small">
          Oppfølgingsplan er ikke aktuell nå
        </ExpansionCard.Title>
        <ExpansionCard.Description>
          Meld fra hvis dere ikke skal lage oppfølgingsplan i denne
          sykefraværsperioden.
        </ExpansionCard.Description>
      </ExpansionCard.Header>

      <ExpansionCard.Content>
        <form onSubmit={handleSubmit} noValidate>
          <VStack gap="space-16">
            <BodyLong>
              Hvis du vurderer at det ikke er behov for en oppfølgingsplan nå,
              kan du melde fra om det her. Du kan ombestemme deg senere og lage
              en plan når som helst.
            </BodyLong>

            {visValideringsfeil && (
              <ErrorSummary
                ref={errorSummaryRef}
                heading="Du må rette dette før du kan melde fra:"
              >
                <ErrorSummary.Item href={`#${BEKREFTELSE_CHECKBOX_ID}`}>
                  Du må bekrefte at oppfølgingsplan ikke er aktuell nå
                </ErrorSummary.Item>
              </ErrorSummary>
            )}

            <Checkbox
              id={BEKREFTELSE_CHECKBOX_ID}
              checked={erBekreftet}
              onChange={handleBekreftelseChange}
              error={visValideringsfeil}
              description="Du kan ombestemme deg og lage en plan senere."
            >
              Jeg bekrefter at det ikke er aktuelt å lage en oppfølgingsplan nå
            </Checkbox>

            <FetchErrorAlert error={error} />

            <Button
              type="submit"
              variant="secondary"
              loading={isPending}
              className="w-fit"
            >
              Meld fra
            </Button>
          </VStack>
        </form>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
