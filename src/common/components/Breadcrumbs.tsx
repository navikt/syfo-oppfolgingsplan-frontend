"use client";

import NextLink from "next/link";
import { ChevronRightIcon } from "@navikt/aksel-icons";
import { Link } from "@navikt/ds-react";

interface Props {
  /** Href for the first (link) level */
  firstCrumbOppfolgingsplanerHref: string;
  /** Text for the second (current) level */
  secondCrumbText: string;
}

/**
 * Breadcrumb navigation within the Oppfølgingsplaner pages.
 * Simple two-level breadcrumb: Oppfølgingsplaner (link) > second (text)
 */
export function Breadcrumbs({
  firstCrumbOppfolgingsplanerHref,
  secondCrumbText,
}: Props) {
  return (
    <nav aria-label="Brødsmulesti" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link as={NextLink} href={firstCrumbOppfolgingsplanerHref}>
            Oppfølgingsplaner
          </Link>
        </li>

        <li aria-hidden>
          <ChevronRightIcon aria-hidden fontSize="1.2rem" />
        </li>

        <li>
          <span aria-current="page">{secondCrumbText}</span>
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
