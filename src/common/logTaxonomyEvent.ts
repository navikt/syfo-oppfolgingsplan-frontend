"use client";

import { EventName, type TaxonomyEvent } from "@navikt/analytics-types";
import { getAnalyticsInstance } from "@navikt/nav-dekoratoren-moduler";
import { isLocalOrDemo } from "@/env-variables/envHelpers.ts";

const logger = getAnalyticsInstance("syfo-oppfolgingsplan-frontend");

export function logTaxonomyEvent<K extends EventName>(event: TaxonomyEvent<K>) {
  if (isLocalOrDemo) {
    console.log("Taxonomy event logged:", event);
    return;
  }

  logger(event.name, event.properties);
}
