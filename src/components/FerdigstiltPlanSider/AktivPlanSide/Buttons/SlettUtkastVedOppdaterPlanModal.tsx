import { BodyLong, Button, Modal } from "@navikt/ds-react";

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function SlettUtkastVedOppdaterPlanModal({ ref }: Props) {
  return (
    <Modal
      ref={ref}
      header={{
        heading: "Slett utkast?",
        closeButton: false,
      }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>
          Du har allerede et utkast. Hvis du fortsetter vil utkastet ditt bli
          slettet og erstattet med en kopi av denne planen. Vil du fortsette?
        </BodyLong>
      </Modal.Body>

      <Modal.Footer>
        <Button type="submit" variant="danger">
          Slett utkast og fortsett
        </Button>

        <Button variant="secondary" onClick={() => ref.current?.close()}>
          Behold utkastet mitt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
