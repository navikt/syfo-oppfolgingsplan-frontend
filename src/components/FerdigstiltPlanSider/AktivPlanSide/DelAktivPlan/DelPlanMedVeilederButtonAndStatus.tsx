"use client";

import { Alert, HStack, VStack } from "@navikt/ds-react";
import { getFormattedDateAndTimeString } from "@/ui-helpers/dateAndTime";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";
import { usePlanDelingContext } from "../PlanDelingContext";
import { DelPlanButtonFlexGrowContainer } from "./DelPlanButtonFlexGrowContainer";

interface Props {
  planId: string;
  userHasEditAccess: boolean;
}

export function DelPlanMedVeilederButtonAndStatus({
  planId,
  userHasEditAccess,
}: Props) {
  const {
    deltMedVeilederTidspunkt,
    delMedVeilederAction,
    isPendingDelMedVeileder,
    errorDelMedVeileder,
  } = usePlanDelingContext();

  return (
    <VStack gap="4">
      <HStack gap="8" align="center">
        <DelPlanButtonFlexGrowContainer>
          <form action={() => delMedVeilederAction({ planId })}>
            <TrackedButton
              type="submit"
              variant="primary"
              loading={isPendingDelMedVeileder}
              disabled={!userHasEditAccess || Boolean(deltMedVeilederTidspunkt)}
              tracking={{
                komponentId: "del-med-nav-knapp",
                tekst: "Send til Nav-veileder",
                kontekst: "AktivPlanSide",
              }}
            >
              Send til Nav-veileder
            </TrackedButton>
          </form>
        </DelPlanButtonFlexGrowContainer>

        {deltMedVeilederTidspunkt && (
          <Alert variant="success" inline>
            Sendt til Nav-veileder{" "}
            {getFormattedDateAndTimeString(deltMedVeilederTidspunkt)}.
          </Alert>
        )}
      </HStack>

      <FetchErrorAlert error={errorDelMedVeileder} />
    </VStack>
  );
}
