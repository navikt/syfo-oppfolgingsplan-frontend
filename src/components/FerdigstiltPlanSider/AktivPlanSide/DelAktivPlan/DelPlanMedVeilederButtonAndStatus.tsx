"use client";

import { HStack, InlineMessage, VStack } from "@navikt/ds-react";
import { getFormattedDateAndTimeString } from "@/ui-helpers/dateAndTime";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";
import { usePlanDelingContext } from "../PlanDelingContext";
import { DelPlanButtonFlexGrowContainer } from "./DelPlanButtonFlexGrowContainer";

interface Props {
  planId: string;
}

export function DelPlanMedVeilederButtonAndStatus({ planId }: Props) {
  const {
    deltMedVeilederTidspunkt,
    delMedVeilederAction,
    isPendingDelMedVeileder,
    errorDelMedVeileder,
  } = usePlanDelingContext();

  return (
    <VStack gap="4">
      <HStack gap="8" align="center">
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
        )}
      </HStack>

      <FetchErrorAlert error={errorDelMedVeileder} />
    </VStack>
  );
}
