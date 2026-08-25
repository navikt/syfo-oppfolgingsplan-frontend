import { LocalAlert } from "@navikt/ds-react";
import {
  LocalAlertContent,
  LocalAlertHeader,
  LocalAlertTitle,
} from "@navikt/ds-react/LocalAlert";

interface Props {
  erITiltaksgruppe?: boolean;
}

export function IngenAktivPlanAlert({ erITiltaksgruppe = false }: Props) {
  return (
    <LocalAlert status="announcement" className="mb-8">
      <LocalAlertHeader>
        <LocalAlertTitle as="h3">
          {erITiltaksgruppe
            ? "Du har ikke en aktiv oppfølgingsplan"
            : "Du har ikke en oppfølgingsplan"}
        </LocalAlertTitle>
      </LocalAlertHeader>
      <LocalAlertContent>
        {erITiltaksgruppe
          ? "Dersom du og lederen din ikke har laget en plan ennå, kan du be om at dere gjør det sammen."
          : "Du kan når som helst be arbeidsgiveren din om å lage en plan."}
      </LocalAlertContent>
    </LocalAlert>
  );
}
