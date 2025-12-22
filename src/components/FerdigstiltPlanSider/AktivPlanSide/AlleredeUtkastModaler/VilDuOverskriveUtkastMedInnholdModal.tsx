import { useActionState } from "react";
import { useParams } from "next/navigation";
import { BodyLong, Modal } from "@navikt/ds-react";
import { upsertUtkastWithAktivPlanServerAction } from "@/server/actions/upsertUtkastWithAktivPlanServerAction";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";

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

        <FetchErrorAlert error={error} className="mt-4" />
      </Modal.Body>

      <Modal.Footer>
        <form action={() => overskrivUtkastAction(narmesteLederId)}>
          <TrackedButton
            type="submit"
            variant="primary"
            loading={isPendingOverskrivUtkast}
            tracking={{
              komponentId: "erstatt-utkast-og-fortsett-knapp",
              tekst: "Erstatt utkast og fortsett",
              kontekst: "vil-du-overskrive-utkast-modal",
            }}
          >
            Erstatt utkast og fortsett
          </TrackedButton>
        </form>

        <TrackedButton
          variant="secondary"
          onClick={() => ref.current?.close()}
          tracking={{
            komponentId: "avbryt-erstatt-utkast-knapp",
            tekst: "Avbryt",
            kontekst: "vil-du-overskrive-utkast-modal",
          }}
        >
          Avbryt
        </TrackedButton>
      </Modal.Footer>
    </Modal>
  );
}
