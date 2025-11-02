import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, HStack, VStack } from "@navikt/ds-react";
import UtkastSistLagretInfo from "./UtkastLagringInfo";

interface Props {
  isSavingUtkast: boolean;
  sistLagretUtkastTidspunkt: Date | null;
  handleGoToOppsummering: () => Promise<void>;
  handleAvsluttOgFortsettSenere: () => Promise<void>;
}

export default function KnapperOgUtkastLagringInfo({
  isSavingUtkast,
  sistLagretUtkastTidspunkt,
  handleGoToOppsummering,
  handleAvsluttOgFortsettSenere,
}: Props) {
  return (
    <VStack gap="8" align="start" className="mt-10">
      <HStack gap="8">
        {/* TODO: legg til loading state hvis utkast blir lagret */}
        <Button
          variant="primary"
          iconPosition="right"
          icon={<ArrowRightIcon aria-hidden />}
          onClick={handleGoToOppsummering}
        >
          Gå til oppsummering
        </Button>
      </HStack>

      <HStack gap="12" align="center">
        <Button variant="tertiary" onClick={handleAvsluttOgFortsettSenere}>
          Avslutt og fortsett senere
        </Button>

        {(isSavingUtkast || sistLagretUtkastTidspunkt) && (
          <UtkastSistLagretInfo
            isSavingUtkast={isSavingUtkast}
            sistLagretUtkastTidspunkt={sistLagretUtkastTidspunkt}
          />
        )}
      </HStack>
    </VStack>
  );
}
