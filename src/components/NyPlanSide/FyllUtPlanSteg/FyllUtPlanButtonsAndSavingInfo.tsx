import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, HStack, VStack } from "@navikt/ds-react";

interface Props {
  isPendingProceed: boolean;
  isPendingExit: boolean;
  onGoToOppsummeringClick: () => void;
  onAvsluttOgFortsettSenereClick: () => void;
  utkastLagringInfo: React.ReactNode;
}

export default function FyllUtPlanButtonsAndSavingInfo({
  isPendingProceed,
  isPendingExit,
  onGoToOppsummeringClick,
  onAvsluttOgFortsettSenereClick,
  utkastLagringInfo,
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

      <HStack gap="12" align="center">
        <Button
          variant="tertiary"
          onClick={onAvsluttOgFortsettSenereClick}
          loading={isPendingExit}
          disabled={isPendingProceed}
        >
          Avslutt og fortsett senere
        </Button>

        {utkastLagringInfo}
      </HStack>
    </VStack>
  );
}
