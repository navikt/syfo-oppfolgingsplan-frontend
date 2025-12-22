import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, HStack, VStack } from "@navikt/ds-react";
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
          tracking={{
            komponentId: "ga-tilbake-fra-oppsummering-knapp",
            tekst: "Gå tilbake",
            kontekst: "Oppsummering",
          }}
        >
          Gå tilbake
        </TrackedButton>

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
        <TrackedButton
          variant="tertiary"
          disabled
          tracking={{
            komponentId: "avslutt-og-fortsett-senere-knapp",
            tekst: "Avslutt og fortsett senere",
            kontekst: "NyPlanSide",
          }}
        >
          Avslutt og fortsett senere
        </TrackedButton>
      ) : (
        <TrackedButton
          variant="tertiary"
          as={NextLink}
          href={oversiktHref}
          tracking={{
            komponentId: "avslutt-og-fortsett-senere-knapp",
            tekst: "Avslutt og fortsett senere",
            kontekst: "Oppsummering",
          }}
        >
          Avslutt og fortsett senere
        </TrackedButton>
      )}
    </VStack>
  );
}
