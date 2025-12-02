import { BodyLong, Button, Modal } from "@navikt/ds-react";
import useSlettUtkastAction from "./useSlettUtkastAction";

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
}

export function SlettUtkastModal({ modalRef }: Props) {
  const { slettUtkastAction, isPendingSlettUtkast, error } =
    useSlettUtkastAction();

  return (
    <Modal
      ref={modalRef}
      header={{
        heading: "Slett utkast",
        closeButton: false,
      }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>Er du sikker på at du vil slette utkastet ditt?</BodyLong>

        {error && <>{/* TODO: Vise feilmelding */}</>}
      </Modal.Body>

      <Modal.Footer>
        <form
          action={() =>
            slettUtkastAction({
              onSuccess: () => modalRef.current?.close(),
            })
          }
        >
          <Button
            type="submit"
            variant="primary"
            loading={isPendingSlettUtkast}
          >
            Slett utkast
          </Button>
        </form>

        <Button variant="secondary" onClick={() => modalRef.current?.close()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
