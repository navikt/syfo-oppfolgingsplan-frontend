"use client";

import { startTransition, useActionState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Button, HStack } from "@navikt/ds-react";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { upsertUtkastWithAktivPlanServerAction } from "@/server/actions/upsertUtkastWithAktivPlanServerAction";
import { LastNedSomPdfButton } from "../../Shared/Buttons/LastNedSomPdfButton";
import { VilDuOverskriveUtkastModal } from "../AlleredeUtkastModaler/VilDuOverskriveUtkastMedInnholdModal";
import { VilDuSletteUtkastModal } from "../AlleredeUtkastModaler/VilDuSletteUtkastModal";

interface Props {
  planId: string;
  hasUtkast: boolean;
}

export function AktivPlanButtons({ planId, hasUtkast }: Props) {
  const { push } = useRouter();
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const vilDuOverskriveUtkastModal = useRef<HTMLDialogElement | null>(null);
  const vilDuSletteUtkastModal = useRef<HTMLDialogElement | null>(null);

  const [
    { error: upsertUtkastWithAktivPlanError },
    upsertUtkastWithAktivPlanAction,
    isPendingUpsertUtkastWithAktivPlan,
  ] = useActionState(upsertUtkastWithAktivPlanServerAction, {
    error: null,
  });

  function handleEndreOppfolgingsplanClick() {
    if (hasUtkast) {
      vilDuOverskriveUtkastModal.current?.showModal();
    } else {
      startTransition(() => {
        upsertUtkastWithAktivPlanAction(narmesteLederId);
      });
    }
  }

  function handleNyPlanClick() {
    if (hasUtkast) {
      vilDuSletteUtkastModal.current?.showModal();
    } else {
      push(getAGOpprettNyPlanHref(narmesteLederId));
    }
  }

  return (
    <>
      <VilDuOverskriveUtkastModal ref={vilDuOverskriveUtkastModal} />
      <VilDuSletteUtkastModal ref={vilDuSletteUtkastModal} />

      <HStack justify="space-between">
        <HStack gap="4">
          <Button
            variant="primary"
            onClick={handleEndreOppfolgingsplanClick}
            loading={isPendingUpsertUtkastWithAktivPlan}
          >
            Endre oppfølgingsplanen
          </Button>

          <Button variant="secondary" onClick={handleNyPlanClick}>
            Lag en ny plan
          </Button>
        </HStack>

        <LastNedSomPdfButton
          narmesteLederId={narmesteLederId}
          planId={planId}
        />
      </HStack>

      {/* TODO: Improve error message */}
      {upsertUtkastWithAktivPlanError && (
        <Alert variant="error">Beklager, noe gikk galt.</Alert>
      )}
    </>
  );
}
