"use client";

import { useRef } from "react";
import { Button } from "@navikt/ds-react";
import { SlettUtkastModal } from "./SlettUtkastModal";

export function SlettUtkastButtonAndModal() {
  const modalRef = useRef<HTMLDialogElement>(null);

  function openModal() {
    modalRef.current?.showModal();
  }

  return (
    <>
      <Button variant="tertiary" onClick={openModal} className="self-start">
        Slett utkast
      </Button>

      <SlettUtkastModal modalRef={modalRef} />
    </>
  );
}
