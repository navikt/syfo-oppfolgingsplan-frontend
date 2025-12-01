"use client";

import { Alert, Button, HStack, VStack } from "@navikt/ds-react";
import { getLocaleDateAndTimeString } from "@/common/dateAndTime";
import { usePlanDelingContext } from "../PlanDelingContextForAG";
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
    <VStack gap="4">
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

        {deltMedLegeTidspunkt && (
          <Alert variant="success" inline>
            Delt med fastlege{" "}
            {getLocaleDateAndTimeString(deltMedLegeTidspunkt, "long")}.
          </Alert>
        )}
      </HStack>

      {errorDelMedLege && (
        // TODO: Show this error message for specific error codes only
        <Alert variant="error">
          Du får dessverre ikke delt denne planen med legen herfra. Det kan
          hende at den ansatte ikke har en fastlege, eller at fastlegen ikke kan
          ta imot elektroniske meldinger. I dette tilfellet må dere laste ned og
          skrive ut planen slik at dere får delt den med legen manuelt.
        </Alert>
      )}
    </VStack>
  );
}
