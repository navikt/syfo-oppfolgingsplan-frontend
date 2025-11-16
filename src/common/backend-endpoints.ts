import { getServerEnv } from "@/env-variables/serverEnv";

const getAGEndpointPrefix = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}`;

export const getEndpointOversiktForAG = (narmesteLederId: string) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/oversikt`;

export const getEndpointUtkastForAG = (narmesteLederId: string) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/utkast`;

export const getEndpointAktivPlanForAG = (narmesteLederId: string) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/aktivPlan`;

export const getEndpointTidligerePlanForAG = (
  narmesteLederId: string,
  planId: string,
) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/tidligerePlan/${planId}`;
