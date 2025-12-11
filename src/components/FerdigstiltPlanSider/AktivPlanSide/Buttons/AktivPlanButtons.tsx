"use client";

import { useRef } from "react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { Button, HStack } from "@navikt/ds-react";
import { getAGOpprettNyPlanHref } from "@/common/route-hrefs";
import { LastNedSomPdfButton } from "../../Shared/Buttons/LastNedSomPdfButton";
import { OverskrivUtkastModal } from "../OverskrivUtkastModal/OverskrivUtkastMedInnholdFraAktivPlanModal";

interface Props {
  planId: string;
  userHasEditAccess: boolean;
}

export function AktivPlanButtons({ planId, userHasEditAccess }: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();
  const modalRef = useRef<HTMLDialogElement | null>(null);

  return (
    <>
      <OverskrivUtkastModal ref={modalRef} />

      <HStack justify="space-between">
        <HStack gap="4">
          <Button
            disabled={!userHasEditAccess}
            variant="primary"
            onClick={() => modalRef.current?.showModal()}
          >
            Endre oppfølgingsplanen
          </Button>

          {userHasEditAccess ? (
            <Button
              variant="secondary"
              as={NextLink}
              href={getAGOpprettNyPlanHref(narmesteLederId)}
            >
              Lag en ny plan
            </Button>
          ) : (
            <Button variant="secondary" disabled={true}>
              Lag en ny plan
            </Button>
          )}
        </HStack>

        <LastNedSomPdfButton
          narmesteLederId={narmesteLederId}
          planId={planId}
        />
      </HStack>
    </>
  );
}
