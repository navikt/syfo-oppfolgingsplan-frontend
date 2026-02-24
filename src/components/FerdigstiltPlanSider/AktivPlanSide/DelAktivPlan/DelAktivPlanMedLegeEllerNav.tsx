"use client";

import { type RefObject, useRef, useState } from "react";
import {
  BodyLong,
  Box,
  Button,
  Checkbox,
  ErrorSummary,
  Heading,
  InlineMessage,
} from "@navikt/ds-react";
import { usePlanDelingContext } from "@/components/FerdigstiltPlanSider/AktivPlanSide/PlanDelingContext.tsx";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";
import { getFormattedDateAndTimeString } from "@/ui-helpers/dateAndTime.ts";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";

interface Props {
  planId: string;
}

interface RecipientSectionProps {
  id: string;
  name: string;
  label: string;
  sentTimestamp: string | null;
  error: FetchResultError | null;
  errorMessage: string;
  checkboxRef: RefObject<HTMLInputElement | null>;
}

function SentMessage({
  timestamp,
  recipient,
}: {
  timestamp: string;
  recipient: string;
}) {
  return (
    <InlineMessage status="success" role="status" className="py-3">
      Sendt til {recipient}
      {timestamp && ` ${getFormattedDateAndTimeString(timestamp)}`}.
    </InlineMessage>
  );
}

function RecipientCheckbox({
  id,
  name,
  label,
  error,
  errorMessage,
  checkboxRef,
}: RecipientSectionProps) {
  return (
    <div>
      <Checkbox id={id} ref={checkboxRef} name={name}>
        {label}
      </Checkbox>
      {error && (
        <FetchErrorAlert
          error={error}
          fallbackMessage={errorMessage}
          className="mt-2"
        />
      )}
    </div>
  );
}

function DelAktivPlanMedLegeEllerNav({ planId }: Props) {
  const {
    deltMedLegeTidspunkt,
    deltMedVeilederTidspunkt,
    delMedLegeAction,
    delMedVeilederAction,
    isPendingDelMedLege,
    isPendingDelMedVeileder,
    errorDelMedLege,
    errorDelMedVeileder,
  } = usePlanDelingContext();

  const fastlegeCheckboxRef = useRef<HTMLInputElement>(null);
  const veilederCheckboxRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isSending = isPendingDelMedLege || isPendingDelMedVeileder;
  const sentToFastlege = Boolean(deltMedLegeTidspunkt);
  const sentToVeileder = Boolean(deltMedVeilederTidspunkt);
  const hasUnsentRecipients = !sentToFastlege || !sentToVeileder;

  const handleSubmit = (formData: FormData) => {
    const sendToFastlege = formData.get("sendToFastlege") === "on";
    const sendToVeileder = formData.get("sendToVeileder") === "on";

    if (!sendToFastlege && !sendToVeileder) {
      setValidationError(
        "Du må velge minst ett alternativ for å sende planen.",
      );
      return;
    }

    setValidationError(null);

    if (sendToFastlege) delMedLegeAction({ planId });
    if (sendToVeileder) delMedVeilederAction({ planId });
  };

  return (
    <Box
      background="info-soft"
      padding="space-24"
      borderRadius="12"
      borderColor="neutral-subtle"
      borderWidth="1"
    >
      <Heading level="2" size="medium" spacing>
        Hvem vil du sende planen til
      </Heading>
      <BodyLong>
        Du skal sende oppfølgingsplanen til fastlegen innen den ansatte har vært
        helt eller delvis borte fra jobben i 4 uker. I tillegg kan du sende
        planen til Nav når du selv ønsker, når Nav ber om den, eller senest én
        uke før et dialogmøte med Nav.
      </BodyLong>

      <form action={handleSubmit}>
        {sentToFastlege ? (
          <SentMessage timestamp={deltMedLegeTidspunkt!} recipient="fastlege" />
        ) : (
          <RecipientCheckbox
            id="fastlege-checkbox"
            name="sendToFastlege"
            label="Fastlegen til den ansatte"
            sentTimestamp={deltMedLegeTidspunkt}
            error={errorDelMedLege}
            errorMessage="Kunne ikke sende planen til fastlege. Prøv igjen."
            checkboxRef={fastlegeCheckboxRef}
          />
        )}

        {sentToVeileder ? (
          <SentMessage
            timestamp={deltMedVeilederTidspunkt!}
            recipient="Nav-veileder"
          />
        ) : (
          <RecipientCheckbox
            id="veileder-checkbox"
            name="sendToVeileder"
            label="Nav-veilederen"
            sentTimestamp={deltMedVeilederTidspunkt}
            error={errorDelMedVeileder}
            errorMessage="Kunne ikke sende planen til Nav-veileder. Prøv igjen."
            checkboxRef={veilederCheckboxRef}
          />
        )}

        {validationError && (
          <ErrorSummary heading="Feil ved sending av plan" className="my-4">
            <ErrorSummary.Item href="#fastlege-checkbox">
              {validationError}
            </ErrorSummary.Item>
          </ErrorSummary>
        )}

        {hasUnsentRecipients && (
          <Button type="submit" loading={isSending} className="mt-4">
            Send planen
          </Button>
        )}
      </form>
    </Box>
  );
}

export default DelAktivPlanMedLegeEllerNav;
