export const NYLIG_OPPRETTET_SEARCH_PARAM = "nyligOpprettet";

// Route segments - eksportert for bruk i breadcrumbs etc.
export const SM_SEGMENT = "sykmeldt";
export const AKTIV_PLAN_SEGMENT = "aktiv-plan";
export const TIDLIGERE_PLANER_SEGMENT = "tidligere-planer";

const opprettPlanSegment = "ny-plan";

// ==================== Arbeidsgiver routes ====================

export const getAGOversiktHref = (narmesteLederId: string) =>
  `/${narmesteLederId}`;

export const getAGOpprettNyPlanHref = (narmesteLederId: string) =>
  `/${narmesteLederId}/${opprettPlanSegment}`;

export const getAGAktivPlanHref = (narmesteLederId: string) =>
  `/${narmesteLederId}/${AKTIV_PLAN_SEGMENT}`;

export const getAGAktivPlanNyligOpprettetHref = (narmesteLederId: string) =>
  `/${narmesteLederId}/${AKTIV_PLAN_SEGMENT}?${NYLIG_OPPRETTET_SEARCH_PARAM}=true`;

export const getAGTidligerePlanHref = (
  narmesteLederId: string,
  planId: string,
) => `/${narmesteLederId}/${TIDLIGERE_PLANER_SEGMENT}/${planId}`;

// ==================== Sykmeldt routes ====================

export const getSMOversiktHref = () => `/${SM_SEGMENT}`;

export const getSMAktivPlanHref = (planId: string) =>
  `/${SM_SEGMENT}/${AKTIV_PLAN_SEGMENT}/${planId}`;

export const getSMTidligerePlanHref = (planId: string) =>
  `/${SM_SEGMENT}/${TIDLIGERE_PLANER_SEGMENT}/${planId}`;
