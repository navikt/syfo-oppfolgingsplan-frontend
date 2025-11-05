export const getAGOversiktHref = (narmesteLederId: string) =>
  `/${narmesteLederId}`;

export const lagPlanRouteSegment = "opprett-plan";

export const getAGNyPlanHref = (narmesteLederId: string) =>
  `/${narmesteLederId}/${lagPlanRouteSegment}`;

export const getAGOppfolgingplanHref = (
  narmesteLederId: string,
  oppfolgingsplanUuid: string
) => `/${narmesteLederId}/${oppfolgingsplanUuid}`;
