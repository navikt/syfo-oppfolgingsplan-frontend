export const getAGOversiktHref = (narmesteLederId: string) =>
  `/${narmesteLederId}`;

const opprettPlanRouteSegment = "opprett-plan";

export const getAGOpprettNyPlanHref = (narmesteLederId: string) =>
  `/${narmesteLederId}/${opprettPlanRouteSegment}`;

export const getAGOppfolgingplanHref = (
  narmesteLederId: string,
  oppfolgingsplanUuid: string,
) => `/${narmesteLederId}/${oppfolgingsplanUuid}`;
