import "server-only";
import { getServerEnv } from "@/env-variables/serverEnv";

const getAGEndpointPrefix = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}`;

export const getEndpointOversiktForAG = (narmesteLederId: string) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/oversikt`;

export const getEndpointUtkastForAG = (narmesteLederId: string) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/utkast`;

export const getEndpointAktivPlanForAG = (narmesteLederId: string) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/aktiv-plan`;

export const getEndpointFerdigstiltPlanForAG = (
  narmesteLederId: string,
  planId: string,
) => `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/${planId}`;

export const getEndpointOppfolgingsplanerForAG = (narmesteLederId: string) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner`;

export const getEndpointDelMedLegeForAG = (
  narmesteLederId: string,
  planId: string,
) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/${planId}/del-med-lege`;

export const getEndpointDelMedVeilederForAG = (
  narmesteLederId: string,
  planId: string,
) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/${planId}/del-med-veileder`;

export const getEndpointPDFForAG = (
  narmesteLederId: string,
  documentId: string,
) =>
  `${getAGEndpointPrefix(narmesteLederId)}/oppfolgingsplaner/${documentId}/pdf`;
