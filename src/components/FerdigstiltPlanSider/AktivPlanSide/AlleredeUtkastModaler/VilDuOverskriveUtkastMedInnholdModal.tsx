import { useActionState } from "react";
import { useParams } from "next/navigation";
import { Alert, BodyLong, Button, Modal } from "@navikt/ds-react";
import { upsertUtkastWithAktivPlanServerAction } from "@/server/actions/upsertUtkastWithAktivPlanServerAction";

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function VilDuOverskriveUtkastModal({ ref }: Props) {
  const { narmesteLederId } = useParams<{ narmesteLederId: string }>();

  const [{ error }, overskrivUtkastAction, isPendingOverskrivUtkast] =
    useActionState(upsertUtkastWithAktivPlanServerAction, {
      error: null,
    });

  return (
    <Modal
      ref={ref}
      header={{
        heading: "Erstatt utkast?",
      }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>
          Du har allerede et utkast. Hvis du fortsetter vil utkastet ditt bli
          erstattet med innholdet i denne planen. Vil du fortsette?
        </BodyLong>

        {error && (
          <Alert variant="error" className="mt-4">
            Beklager, noe gikk galt. Vennligst prøv igjen senere.
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <form action={() => overskrivUtkastAction(narmesteLederId)}>
          <Button
            type="submit"
            variant="primary"
            loading={isPendingOverskrivUtkast}
          >
            Erstatt utkast og fortsett
          </Button>
        </form>

        <Button variant="secondary" onClick={() => ref.current?.close()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
