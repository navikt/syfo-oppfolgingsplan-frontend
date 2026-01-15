import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, HStack, VStack } from "@navikt/ds-react";
import { knappKlikket } from "@/common/analytics/events-and-properties/knappKlikket-properties";
import { getAGOversiktHref } from "@/common/route-hrefs";
import { TrackedButton } from "@/ui/TrackedButton";

interface Props {
  isPendingFerdigstill: boolean;
  onGoBackClick: () => void;
  onFerdigstillPlanClick: () => void;
}

export default function OppsummeringButtons({
  isPendingFerdigstill,
  onGoBackClick,
  onFerdigstillPlanClick,
}: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const oversiktHref = getAGOversiktHref(narmesteLederId);

  return (
    <VStack gap="8" align="start">
      <HStack gap="8">
        <TrackedButton
          variant="secondary"
          iconPosition="left"
          icon={<ArrowLeftIcon aria-hidden />}
          onClick={onGoBackClick}
          disabled={isPendingFerdigstill}
          tracking={knappKlikket.nyPlanSide.oppsummeringSteg.gaTilbake}
        >
          Gå tilbake
        </TrackedButton>

        {/* The ferdigstill user action is tracked elsewhere as SKJEMA_FULLFORT */}
        <Button
          variant="primary"
          onClick={onFerdigstillPlanClick}
          loading={isPendingFerdigstill}
        >
          Ferdigstill og del med den ansatte
        </Button>
      </HStack>

      {isPendingFerdigstill ? (
        // Seperate because anchor cannot be disabled
        <Button variant="tertiary" disabled>
          Avslutt og fortsett senere
        </Button>
      ) : (
        <TrackedButton
          variant="tertiary"
          as={NextLink}
          href={oversiktHref}
          tracking={
            knappKlikket.nyPlanSide.oppsummeringSteg.avsluttOgFortsettSenere
          }
        >
          Avslutt og fortsett senere
        </TrackedButton>
      )}
    </VStack>
  );
}
