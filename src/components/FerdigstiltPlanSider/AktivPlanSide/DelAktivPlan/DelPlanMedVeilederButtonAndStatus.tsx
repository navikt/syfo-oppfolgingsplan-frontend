"use client";

import { Alert, Button, HStack } from "@navikt/ds-react";
import { getFormattedDateAndTimeString } from "@/ui-helpers/dateAndTime";
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
    <HStack gap="8" align="center">
      <DelPlanButtonFlexGrowContainer>
        <form action={() => delMedVeilederAction({ planId })}>
          <Button
            type="submit"
            variant="primary"
            loading={isPendingDelMedVeileder}
            disabled={!userHasEditAccess || Boolean(deltMedVeilederTidspunkt)}
          >
            Send til Nav-veileder
          </Button>
        </form>
      </DelPlanButtonFlexGrowContainer>

      {deltMedVeilederTidspunkt ? (
        <Alert variant="success" inline>
          Delt med Nav-veileder{" "}
          {getFormattedDateAndTimeString(deltMedVeilederTidspunkt)}.
        </Alert>
      ) : (
        errorDelMedVeileder && <>{/* TODO: Show some error message */}</>
      )}
    </HStack>
  );
}
