"use client";

import { LocalAlert } from "@navikt/ds-react";
import {
  LocalAlertCloseButton,
  LocalAlertContent,
  LocalAlertHeader,
  LocalAlertTitle,
} from "@navikt/ds-react/LocalAlert";
import { useState } from "react";
import MeldUnntakForm from "./MeldUnntakForm";

interface Props {
  ansattNavn: string;
}

export default function MeldUnntakSection({ ansattNavn }: Props) {
  const [erSendt, setErSendt] = useState(false);

  if (!erSendt) {
    return (
      <MeldUnntakForm
        ansattNavn={ansattNavn}
        onSuccess={() => setErSendt(true)}
      />
    );
  }

  return (
    <LocalAlert status="success">
      <LocalAlertHeader>
        <LocalAlertTitle as="h3">
          Meldingen er sendt til Nav og den ansatte
        </LocalAlertTitle>
        <LocalAlertCloseButton onClick={() => setErSendt(false)} />
      </LocalAlertHeader>
      <LocalAlertContent>
        Nav har registrert at det ikke er aktuelt med en oppfølgingsplan for{" "}
        {ansattNavn} nå. Endrer situasjonen seg, kan det bli aktuelt at dere
        lager en plan.
      </LocalAlertContent>
    </LocalAlert>
  );
}
