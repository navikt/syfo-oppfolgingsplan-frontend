export const NYLIG_OPPRETTET_SEARCH_PARAM = "nyligOpprettet";

const sykmeldtSegment = "sykmeldt";
const opprettPlanSegment = "ny-plan";
const aktivPlanSegment = "aktiv-plan";
const tidligerePlanerSegment = "tidligere-planer";

// ==================== Arbeidsgiver routes ====================

export const getAGOversiktHref = (narmesteLederId: string) =>
  `/${narmesteLederId}`;

export const getAGOpprettNyPlanHref = (narmesteLederId: string) =>
  `/${narmesteLederId}/${opprettPlanSegment}`;

export const getAGAktivPlanHref = (narmesteLederId: string) =>
  `/${narmesteLederId}/${aktivPlanSegment}`;

export const getAGAktivPlanNyligOpprettetHref = (narmesteLederId: string) =>
  `/${narmesteLederId}/${aktivPlanSegment}?${NYLIG_OPPRETTET_SEARCH_PARAM}=true`;

export const getAGTidligerePlanHref = (
  narmesteLederId: string,
  planId: string,
) => `/${narmesteLederId}/${tidligerePlanerSegment}/${planId}`;

// ==================== Sykmeldt routes ====================

export const getSMOversiktHref = () => `/${sykmeldtSegment}`;

export const getSMAktivPlanHref = (planId: string) =>
  `/${sykmeldtSegment}/${aktivPlanSegment}/${planId}`;

export const getSMTidligerePlanHref = (planId: string) =>
  `/${sykmeldtSegment}/${tidligerePlanerSegment}/${planId}`;
