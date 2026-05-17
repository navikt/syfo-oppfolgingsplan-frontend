"use client";

import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import { useActionState } from "react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import type { SykmeldtArbeidsforhold } from "@/schema/oversiktResponseSchemas";
import { beOmPlanServerAction } from "@/server/actions/beOmPlan";
import type { FetchUpdateResult } from "@/server/tokenXFetch/FetchResult";
import { TrackedButton } from "@/ui/TrackedButton";
import { getFormattedDateAndTimeString } from "@/ui-helpers/dateAndTime";

interface BeOmOppfolgingsplanProps {
  arbeidsforhold: SykmeldtArbeidsforhold[];
}

export function BeOmOppfolgingsplan({
  arbeidsforhold,
}: BeOmOppfolgingsplanProps) {
  const showOrgName = arbeidsforhold.length > 1;

  return (
    <>
      {arbeidsforhold.map((forhold) => (
        <BeOmOppfolgingsplanForArbeidsforhold
          key={forhold.organisasjonsnummer}
          arbeidsforhold={forhold}
          showOrgName={showOrgName}
        />
      ))}
    </>
  );
}

function BeOmOppfolgingsplanForArbeidsforhold({
  arbeidsforhold,
  showOrgName,
}: {
  arbeidsforhold: SykmeldtArbeidsforhold;
  showOrgName: boolean;
}) {
  switch (arbeidsforhold.foresporselStatus) {
    case "CAN_REQUEST":
      return (
        <CanRequestCard
          arbeidsforhold={arbeidsforhold}
          showOrgName={showOrgName}
        />
      );
    case "ALREADY_REQUESTED":
      return (
        <AlreadyRequestedCard
          arbeidsforhold={arbeidsforhold}
          showOrgName={showOrgName}
        />
      );
    case "MISSING_NARMESTELEDER":
      return (
        <MissingNarmesteLederCard
          arbeidsforhold={arbeidsforhold}
          showOrgName={showOrgName}
        />
      );
    case "HAS_ACTIVE_PLAN":
    case "NARMESTELEDER_UNKNOWN":
      return null;
  }
}

function CanRequestCard({
  arbeidsforhold,
  showOrgName,
}: {
  arbeidsforhold: SykmeldtArbeidsforhold;
  showOrgName: boolean;
}) {
  const [{ error }, beOmPlanAction, isPending] = useActionState(
    innerBeOmPlanAction,
    { error: null },
  );

  async function innerBeOmPlanAction(
    _previousState: FetchUpdateResult,
  ): Promise<FetchUpdateResult> {
    return beOmPlanServerAction(arbeidsforhold.organisasjonsnummer);
  }

  const orgNavn =
    arbeidsforhold.organisasjonsnavn ?? arbeidsforhold.organisasjonsnummer;

  return (
    <Alert variant="info" className="mb-8">
      <Heading level="3" size="small" spacing>
        {showOrgName
          ? `Be lederen din hos ${orgNavn} om å lage en oppfølgingsplan`
          : "Be lederen din om å lage en oppfølgingsplan"}
      </Heading>
      <BodyLong spacing>
        {showOrgName
          ? `Du har ingen oppfølgingsplan hos ${orgNavn}. Hvis du mener at det er behov for å lage en plan nå, kan du be lederen din om å begynne på en oppfølgingsplan. Når du trykker på knappen nedenfor sendes et varsel til lederen din om at du trenger en plan.`
          : "Du har ingen oppfølgingsplan. Hvis du mener at det er behov for å lage en plan nå, kan du be lederen din om å begynne på en oppfølgingsplan. Når du trykker på knappen nedenfor sendes et varsel til lederen din om at du trenger en plan."}
      </BodyLong>

      {error && (
        <Alert variant="error" size="small" className="mb-4">
          Noe gikk galt. Prøv igjen senere.
        </Alert>
      )}

      <form action={beOmPlanAction}>
        <TrackedButton
          type="submit"
          tracking={knappKlikket.oversiktSide.beOmOppfolgingsplan}
          loading={isPending}
        >
          Be lederen din om å lage en oppfølgingsplan
        </TrackedButton>
      </form>
    </Alert>
  );
}

function AlreadyRequestedCard({
  arbeidsforhold,
  showOrgName,
}: {
  arbeidsforhold: SykmeldtArbeidsforhold;
  showOrgName: boolean;
}) {
  const formattedDate = arbeidsforhold.foresporselTidspunkt
    ? getFormattedDateAndTimeString(arbeidsforhold.foresporselTidspunkt)
    : null;

  const orgNavn =
    arbeidsforhold.organisasjonsnavn ?? arbeidsforhold.organisasjonsnummer;

  return (
    <Alert variant="success" className="mb-8">
      <Heading level="3" size="small" spacing>
        {showOrgName
          ? `Du har bedt om en oppfølgingsplan hos ${orgNavn}`
          : "Du har bedt om en oppfølgingsplan"}
      </Heading>
      <BodyLong>
        {formattedDate
          ? `Du ba lederen din om å lage en oppfølgingsplan ${formattedDate}.`
          : "Du har allerede bedt lederen din om å lage en oppfølgingsplan."}
      </BodyLong>
    </Alert>
  );
}

function MissingNarmesteLederCard({
  arbeidsforhold,
  showOrgName,
}: {
  arbeidsforhold: SykmeldtArbeidsforhold;
  showOrgName: boolean;
}) {
  const orgNavn =
    arbeidsforhold.organisasjonsnavn ?? arbeidsforhold.organisasjonsnummer;

  return (
    <Alert variant="warning" className="mb-8">
      <Heading level="3" size="small" spacing>
        {showOrgName
          ? `Vi mangler informasjon om nærmeste leder hos ${orgNavn}`
          : "Vi mangler informasjon om nærmeste leder"}
      </Heading>
      <BodyLong>
        Vi har ikke registrert en nærmeste leder for deg hos {orgNavn}. Ta
        kontakt med arbeidsgiveren din for å få registrert en nærmeste leder.
      </BodyLong>
    </Alert>
  );
}
