import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, HStack, VStack } from "@navikt/ds-react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";

interface Props {
  isPendingProceed: boolean;
  isPendingExit: boolean;
  onGoToOppsummeringClick: () => void;
  onAvsluttOgFortsettSenereClick: () => void;
  utkastLagringInfo: React.ReactNode;
  lagreUtkastError: FetchResultError | null;
}

export default function FyllUtPlanButtonsAndSavingInfo({
  isPendingProceed,
  isPendingExit,
  onGoToOppsummeringClick,
  onAvsluttOgFortsettSenereClick,
  utkastLagringInfo,
  lagreUtkastError,
}: Props) {
  return (
    <VStack gap="8" align="start" className="mt-10">
      <HStack gap="8">
        <Button
          variant="primary"
          iconPosition="right"
          icon={<ArrowRightIcon aria-hidden />}
          onClick={onGoToOppsummeringClick}
          loading={isPendingProceed}
          disabled={isPendingExit}
        >
          Gå til oppsummering
        </Button>
      </HStack>

      <VStack gap="4">
        <HStack gap="12" align="center">
          <TrackedButton
            variant="tertiary"
            onClick={onAvsluttOgFortsettSenereClick}
            loading={isPendingExit}
            disabled={isPendingProceed}
            tracking={
              knappKlikket.nyPlanSide.fyllUtSteg.avsluttOgFortsettSenere
            }
          >
            Avslutt og fortsett senere
          </TrackedButton>

          {utkastLagringInfo}
        </HStack>

        <FetchErrorAlert
          error={lagreUtkastError}
          fallbackMessage="Vi klarte ikke lagre utkastet ditt. Vennligst prøv igjen senere."
        />
      </VStack>
    </VStack>
  );
}
