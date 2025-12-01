import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, HStack, VStack } from "@navikt/ds-react";
import { getAGOversiktHref } from "@/common/route-hrefs";

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
        <Button
          variant="secondary"
          iconPosition="left"
          icon={<ArrowLeftIcon aria-hidden />}
          onClick={onGoBackClick}
          disabled={isPendingFerdigstill}
        >
          Gå tilbake
        </Button>

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
        <Button variant="tertiary" as={NextLink} href={oversiktHref}>
          Avslutt og fortsett senere
        </Button>
      )}
    </VStack>
  );
}
