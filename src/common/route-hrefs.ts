export const NYLIG_OPPRETTET_SEARCH_PARAM = "nyligOpprettet";

const opprettPlanSegment = "ny-plan";
const aktivPlanSegment = "aktiv-plan";
const tidligerePlanerSegment = "tidligere-planer";

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
