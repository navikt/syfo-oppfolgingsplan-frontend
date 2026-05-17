"use client";

import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
} from "@navikt/aksel-icons";
import { Alert, BodyLong } from "@navikt/ds-react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "@navikt/ds-react/InfoCard";
import { useActionState } from "react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import type { SykmeldtArbeidsforhold } from "@/schema/oversiktResponseSchemas";
import { beOmPlanServerAction } from "@/server/actions/beOmPlan";
import type { FetchResultError } from "@/server/tokenXFetch/FetchResult";
import { TrackedButton } from "@/ui/TrackedButton";
import { getFormattedDateAndTimeString } from "@/ui-helpers/dateAndTime";

type BeOmPlanState = { error: FetchResultError | null; submitted: boolean };

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
  const [{ error, submitted }, beOmPlanAction, isPending] = useActionState(
    innerBeOmPlanAction,
    { error: null, submitted: false } as BeOmPlanState,
  );

  async function innerBeOmPlanAction(
    _previousState: BeOmPlanState,
  ): Promise<BeOmPlanState> {
    const result = await beOmPlanServerAction(
      arbeidsforhold.organisasjonsnummer,
    );
    return { error: result.error, submitted: !result.error };
  }

  const orgNavn =
    arbeidsforhold.organisasjonsnavn ?? arbeidsforhold.organisasjonsnummer;

  return (
    <InfoCard data-color="info" className="mb-8">
      <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
        <InfoCardTitle as="h3">
          {showOrgName
            ? `Be lederen din hos ${orgNavn} om å lage en oppfølgingsplan`
            : "Be lederen din om å lage en oppfølgingsplan"}
        </InfoCardTitle>
      </InfoCardHeader>

      <InfoCardContent>
        {submitted ? (
          <>
            <BodyLong spacing>
              {showOrgName
                ? `Du har bedt lederen din hos ${orgNavn} om å lage en oppfølgingsplan. Lederen din har fått et varsel og kan begynne på planen.`
                : "Du har bedt lederen din om å lage en oppfølgingsplan. Lederen din har fått et varsel og kan begynne på planen."}
            </BodyLong>

            <div className="flex items-center gap-2" role="status">
              <CheckmarkCircleFillIcon
                aria-hidden
                className="text-[var(--ax-text-success-decoration)] text-2xl shrink-0"
              />
              <BodyLong>Varsel sendt til lederen din</BodyLong>
            </div>
          </>
        ) : (
          <>
            <BodyLong spacing>
              {showOrgName
                ? `Du har ingen oppfølgingsplan hos ${orgNavn}. Hvis du mener at det er behov for å lage en plan nå, kan du be lederen din om å begynne på en oppfølgingsplan. Når du trykker på knappen nedenfor sendes et varsel til lederen din om at du trenger en plan.`
                : "Du har ingen oppfølgingsplan på denne siden. Hvis du mener at det er behov for å lage en plan nå, kan du be lederen din om å begynne på en oppfølgingsplan. Når du trykker på knappen nedenfor sendes et varsel til lederen din om at du trenger en plan."}
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
          </>
        )}
      </InfoCardContent>
    </InfoCard>
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
    <InfoCard data-color="info" className="mb-8">
      <InfoCardHeader icon={<InformationSquareIcon aria-hidden />}>
        <InfoCardTitle as="h3">
          {showOrgName
            ? `Be lederen din hos ${orgNavn} om å lage en oppfølgingsplan`
            : "Be lederen din om å lage en oppfølgingsplan"}
        </InfoCardTitle>
      </InfoCardHeader>

      <InfoCardContent>
        <BodyLong spacing>
          {showOrgName
            ? `Du har bedt lederen din hos ${orgNavn} om å lage en oppfølgingsplan. Lederen din har fått et varsel og kan begynne på planen.`
            : "Du har bedt lederen din om å lage en oppfølgingsplan. Lederen din har fått et varsel og kan begynne på planen."}
        </BodyLong>

        <div className="flex items-center gap-2" role="status">
          <CheckmarkCircleFillIcon
            aria-hidden
            className="text-[var(--ax-text-success-decoration)] text-2xl shrink-0"
          />
          <BodyLong>
            {formattedDate
              ? `Varsel sendt til lederen din ${formattedDate}`
              : "Du har allerede bedt lederen din om å lage en oppfølgingsplan."}
          </BodyLong>
        </div>
      </InfoCardContent>
    </InfoCard>
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
    <InfoCard data-color="warning" className="mb-8">
      <InfoCardHeader icon={<ExclamationmarkTriangleIcon aria-hidden />}>
        <InfoCardTitle as="h3">
          {showOrgName
            ? `Vi mangler informasjon om nærmeste leder hos ${orgNavn}`
            : "Vi mangler informasjon om nærmeste leder"}
        </InfoCardTitle>
      </InfoCardHeader>

      <InfoCardContent>
        <BodyLong>
          Vi har ikke registrert en nærmeste leder for deg hos {orgNavn}. Ta
          kontakt med arbeidsgiveren din for å få registrert en nærmeste leder.
        </BodyLong>
      </InfoCardContent>
    </InfoCard>
  );
}
