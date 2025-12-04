import { publicEnv } from "@/env-variables/publicEnv";
import {
  AKTIV_PLAN_SEGMENT,
  SM_SEGMENT,
  TIDLIGERE_PLANER_SEGMENT,
} from "./route-hrefs";

type Breadcrumb = { url: string; title: string };

// ==================== SM Breadcrumb titler ====================

export const SM_BREADCRUMB_TITLES: Record<string, string> = {
  [SM_SEGMENT]: "Oppfølgingsplaner",
  [AKTIV_PLAN_SEGMENT]: "Aktiv plan",
  [TIDLIGERE_PLANER_SEGMENT]: "Tidligere planer",
};

// ==================== SM Base Breadcrumbs ====================

/** Hjelpefunksjon for å lage full URL med base path */
export const createFullUrl = (path: string) =>
  `${publicEnv.NEXT_PUBLIC_BASE_PATH}${path}`;

/**
 * Returnerer base-breadcrumbs for sykmeldt-visningen.
 * Brukes både av server (dekoratør) og klient (setBreadcrumbs).
 */
export const getBaseBreadcrumbsForSM = (): Breadcrumb[] => [
  { url: publicEnv.NEXT_PUBLIC_MIN_SIDE_ROOT, title: "Min side" },
  { url: publicEnv.NEXT_PUBLIC_DITT_SYKEFRAVAER_URL, title: "Ditt sykefravær" },
  { url: createFullUrl(`/${SM_SEGMENT}`), title: "Oppfølgingsplaner" },
];
