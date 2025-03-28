"use client";

import React, { useEffect } from "react";
import { logger } from "@navikt/next-logger";
import Image from "next/legacy/image";
import pageErrorDad from "@/images/error-page-dad.svg";
import { BodyLong, Button, Heading } from "@navikt/ds-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  const errorText = "Beklager! Det har oppstått en uventet feil";

  return (
    <div className="flex max-w-3xl flex-col" role="status" aria-live="polite">
      <Image
        src={pageErrorDad}
        alt=""
        className="max-[960px]:max-h[240px] mr-8 flex-[1_1_50%] max-[960px]:mb-4"
      />

      <div>
        <Heading spacing size="large" level="1">
          Oops!
        </Heading>
        <Heading spacing size="small" level="2">
          {errorText}
        </Heading>

        <BodyLong spacing>
          Sannsynligvis jobber vi med saken allerede, men ta kontakt med oss
          hvis det ikke har løst seg til i morgen.
        </BodyLong>
      </div>

      <Button variant="primary" onClick={() => reset()}>
        Klikk her for å prøve igjen
      </Button>
    </div>
  );
}
