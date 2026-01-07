"use client";

import { Alert, HStack, VStack } from "@navikt/ds-react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { getFormattedDateAndTimeString } from "@/ui-helpers/dateAndTime";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";
import { usePlanDelingContext } from "../PlanDelingContext";
import { DelPlanButtonFlexGrowContainer } from "./DelPlanButtonFlexGrowContainer";

interface Props {
  planId: string;
  userHasEditAccess: boolean;
}

export function DelPlanMedLegeButtonAndStatus({
  planId,
  userHasEditAccess,
}: Props) {
  const {
    deltMedLegeTidspunkt,
    delMedLegeAction,
    isPendingDelMedLege,
    errorDelMedLege,
  } = usePlanDelingContext();

  const isDeltMedLege = Boolean(deltMedLegeTidspunkt);
  const isDelButtonDisabled = isDeltMedLege || !userHasEditAccess;

  return (
    <VStack gap="4">
      <HStack gap="8" align="center">
        <DelPlanButtonFlexGrowContainer>
          <form action={() => delMedLegeAction({ planId })}>
            <TrackedButton
              type="submit"
              variant="primary"
              loading={isPendingDelMedLege}
              disabled={isDelButtonDisabled}
              tracking={knappKlikket.aktivPlanSide.delMedFastlege}
            >
              Send til fastlege
            </TrackedButton>
          </form>
        </DelPlanButtonFlexGrowContainer>

        {deltMedLegeTidspunkt && (
          <Alert variant="success" inline>
            Sendt til fastlege{" "}
            {getFormattedDateAndTimeString(deltMedLegeTidspunkt)}.
          </Alert>
        )}
      </HStack>

      <FetchErrorAlert
        error={errorDelMedLege}
        fallbackMessage="Det oppstod en feil ved deling av planen med fastlegen. Vennligst prøv igjen senere."
      />
    </VStack>
  );
}
