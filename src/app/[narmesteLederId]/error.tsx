"use client";

import { BodyLong, Button, Heading } from "@navikt/ds-react";
import { logger } from "@navikt/next-logger";
import Image from "next/image";
import { useEffect } from "react";
import { ERROR_PAGE_DAD_SVG } from "@/common/publicAssets";

// TODO: Forbedre design / styling, gjøre design responsivt, rydde i tailwind-css.

export default function ErrorPage({
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
    // biome-ignore lint/a11y/useSemanticElements: role="status" is semantically correct for dynamic status messages
    <div className="flex max-w-3xl flex-col" role="status" aria-live="polite">
      <Image
        src={ERROR_PAGE_DAD_SVG}
        width={200}
        height={237}
        alt=""
        className="max-[960px]:max-h[240px] mr-8 flex-[1_1_50%] max-[960px]:mb-4"
        unoptimized
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
          hvis det ikke har løst seg til neste virkedag.
        </BodyLong>
      </div>

      <Button variant="primary" onClick={() => reset()}>
        Klikk her for å prøve igjen
      </Button>
    </div>
  );
}
