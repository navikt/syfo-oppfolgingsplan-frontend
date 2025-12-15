"use client";

import { Alert, Button, HStack, VStack } from "@navikt/ds-react";
import { getFormattedDateAndTimeString } from "@/ui-helpers/dateAndTime";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
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

  return (
    <VStack gap="4">
      <HStack gap="8" align="center">
        <DelPlanButtonFlexGrowContainer>
          <form action={() => delMedLegeAction({ planId })}>
            <Button
              type="submit"
              variant="primary"
              loading={isPendingDelMedLege}
              disabled={!userHasEditAccess || Boolean(deltMedLegeTidspunkt)}
            >
              Send til fastlege
            </Button>
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
        customGeneralMessage="Det oppstod en feil ved deling av planen med fastlegen. Vennligst prøv igjen senere."
      />
    </VStack>
  );
}
