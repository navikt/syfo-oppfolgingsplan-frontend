"use client";

import { HStack, InlineMessage, VStack } from "@navikt/ds-react";
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
    <VStack gap="space-16">
      <HStack gap="space-32" align="center">
        {deltMedVeilederTidspunkt ? (
          <InlineMessage status="success" role="status">
            Sendt til Nav-veileder{" "}
            {getFormattedDateAndTimeString(deltMedVeilederTidspunkt)}.
          </InlineMessage>
        ) : (
          <DelPlanButtonFlexGrowContainer>
            <form action={() => delMedVeilederAction({ planId })}>
              <TrackedButton
                type="submit"
                variant="primary"
                loading={isPendingDelMedVeileder}
                disabled={!userHasEditAccess}
                tracking={knappKlikket.aktivPlanSide.delMedVeileder}
              >
                Send til Nav-veileder
              </TrackedButton>
            </form>
          </DelPlanButtonFlexGrowContainer>
        )}
      </HStack>
      <FetchErrorAlert error={errorDelMedVeileder} />
    </VStack>
  );
}
