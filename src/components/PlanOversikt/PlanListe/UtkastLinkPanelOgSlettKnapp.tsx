"use client";

import { Button } from "@navikt/ds-react";

function handleSlettUtkast() {
  // TODO: trigger server action
}

export default function SlettUtkastKnapp() {
  return (
    <Button
      variant="tertiary"
      onClick={handleSlettUtkast}
      className="self-start"
    >
      Slett utkast
    </Button>
  );
}
