"use client";

import { Alert, Button, HStack } from "@navikt/ds-react";
import { getLocaleDateAndTimeString } from "@/ui-helpers/dateAndTime";
import { usePlanDelingContext } from "../PlanDelingContext";
import { DelPlanButtonFlexGrowContainer } from "./DelPlanButtonFlexGrowContainer";

interface Props {
  planId: string;
}

export function DelPlanMedLegeButtonAndStatus({ planId }: Props) {
  const {
    deltMedLegeTidspunkt,
    delMedLegeAction,
    isPendingDelMedLege,
    errorDelMedLege,
  } = usePlanDelingContext();

  return (
    <HStack gap="8" align="center">
      <DelPlanButtonFlexGrowContainer>
        <form action={() => delMedLegeAction({ planId })}>
          <Button
            type="submit"
            variant="primary"
            loading={isPendingDelMedLege}
            disabled={Boolean(deltMedLegeTidspunkt)}
          >
            Send til fastlege
          </Button>
        </form>
      </DelPlanButtonFlexGrowContainer>

      {deltMedLegeTidspunkt ? (
        <Alert variant="success" inline>
          Delt med fastlege{" "}
          {getLocaleDateAndTimeString(deltMedLegeTidspunkt, "long")}.
        </Alert>
      ) : (
        errorDelMedLege && <>{/* TODO: Show some error message */}</>
      )}
    </HStack>
  );
}
