import { useActionState } from "react";
import { useParams } from "next/navigation";
import { Alert, BodyLong, Button, Modal } from "@navikt/ds-react";
import { slettUtkastAndRedirectToNyPlanServerAction } from "@/server/actions/slettUtkast";

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function VilDuSletteUtkastModal({ ref }: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [{ error }, slettUtkastAndRedirectAction, isPendingSlettUtkast] =
    useActionState(slettUtkastAndRedirectToNyPlanServerAction, {
      error: null,
    });

  return (
    <Modal
      ref={ref}
      header={{
        heading: "Slett utkast?",
      }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>
          Du har allerede et utkast. Hvis du fortsetter vil utkastet ditt bli
          slettet. Vil du fortsette?
        </BodyLong>

        {error && (
          <Alert variant="error" className="mt-4">
            Beklager, noe gikk galt. Vennligst prøv igjen senere.
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <form action={() => slettUtkastAndRedirectAction(narmesteLederId)}>
          <Button
            type="submit"
            variant="primary"
            loading={isPendingSlettUtkast}
          >
            Slett utkast og fortsett
          </Button>
        </form>

        <Button variant="secondary" onClick={() => ref.current?.close()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
