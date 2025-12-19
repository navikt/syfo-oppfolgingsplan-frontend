import { useActionState } from "react";
import { useParams } from "next/navigation";
import { BodyLong, Modal } from "@navikt/ds-react";
import { slettUtkastAndRedirectToNyPlanServerAction } from "@/server/actions/slettUtkast";
import { FetchErrorAlert } from "@/ui/FetchErrorAlert";
import { TrackedButton } from "@/ui/TrackedButton";

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

        <FetchErrorAlert error={error} className="mt-4" />
      </Modal.Body>

      <Modal.Footer>
        <form action={() => slettUtkastAndRedirectAction(narmesteLederId)}>
          <TrackedButton
            type="submit"
            variant="primary"
            loading={isPendingSlettUtkast}
            tracking={{
              komponentId: "slett-utkast-og-fortsett-knapp",
              tekst: "Slett utkast og fortsett",
              kontekst: "vil-du-slette-utkast-modal",
            }}
          >
            Slett utkast og fortsett
          </TrackedButton>
        </form>

        <TrackedButton
          variant="secondary"
          onClick={() => {
            ref.current?.close();
          }}
          tracking={{
            komponentId: "avbryt-slett-utkast-knapp",
            tekst: "Avbryt",
            kontekst: "vil-du-slette-utkast-modal",
          }}
        >
          Avbryt
        </TrackedButton>
      </Modal.Footer>
    </Modal>
  );
}
