"use client";

import { Alert, Button, Modal, Textarea, VStack } from "@navikt/ds-react";
import { useState } from "react";
import { useGodkjenningContext } from "./GodkjenningContext";

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function OverstyrGodkjenningModal({ ref }: Props) {
  const { overstyr } = useGodkjenningContext();
  const [begrunnelse, setBegrunnelse] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const trimmedBegrunnelse = begrunnelse.trim();
  const errorMessage =
    hasAttemptedSubmit && !trimmedBegrunnelse
      ? "Du må skrive en begrunnelse for å overstyre godkjenningen."
      : undefined;

  function resetForm() {
    setBegrunnelse("");
    setHasAttemptedSubmit(false);
  }

  function closeModal() {
    ref.current?.close();
  }

  function handleBekreftClick() {
    setHasAttemptedSubmit(true);
    if (!trimmedBegrunnelse) {
      return;
    }

    overstyr(trimmedBegrunnelse);
    closeModal();
  }

  return (
    <Modal
      ref={ref}
      header={{ heading: "Overstyr godkjenning" }}
      closeOnBackdropClick
      onClose={resetForm}
    >
      <Modal.Body>
        <VStack gap="space-16">
          <Alert variant="warning">
            Begrunnelsen vil være synlig for den ansatte, fastlege og Nav.
          </Alert>

          <Textarea
            label="Begrunnelse"
            description="Forklar hvorfor du overstyrer godkjenningen"
            value={begrunnelse}
            onChange={(event) => setBegrunnelse(event.target.value)}
            error={errorMessage}
            minRows={4}
            maxLength={500}
            resize="vertical"
            required
          />
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <Button type="button" variant="danger" onClick={handleBekreftClick}>
          Bekreft overstyring
        </Button>

        <Button type="button" variant="secondary" onClick={closeModal}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OverstyrGodkjenningModal;
