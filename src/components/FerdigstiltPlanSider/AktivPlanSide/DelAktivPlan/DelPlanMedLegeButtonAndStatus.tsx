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
        {deltMedLegeTidspunkt ? (
          <InlineMessage status="success" role="status">
            Sendt til fastlege{" "}
            {getFormattedDateAndTimeString(deltMedLegeTidspunkt)}.
          </InlineMessage>
        ) : (
          <DelPlanButtonFlexGrowContainer>
            <form action={() => delMedLegeAction({ planId })}>
              <TrackedButton
                type="submit"
                variant="primary"
                loading={isPendingDelMedLege}
                tracking={{
                  komponentId: "del-med-fastlege-knapp",
                  tekst: "Send til fastlege",
                  kontekst: "AktivPlanSide",
                }}
              >
                Send til fastlege
              </TrackedButton>
            </form>
          </DelPlanButtonFlexGrowContainer>
        )}
      </HStack>

      <FetchErrorAlert
        error={errorDelMedLege}
        fallbackMessage="Det oppstod en feil ved deling av planen med fastlegen. Vennligst prøv igjen senere."
      />
    </VStack>
  );
}
