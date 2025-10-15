export const getAGNyPlanHref = (narmesteLederId: string) =>
  `${narmesteLederId}/ny-plan`;

export const getAGOppfolgingplanHref = (
  narmesteLederId: string,
  oppfolgingsplanUuid: string
) => `${narmesteLederId}/${oppfolgingsplanUuid}`;
