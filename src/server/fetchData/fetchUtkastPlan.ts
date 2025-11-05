import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { utkastResponseSchema } from "@/schema/formSnapshot-schema";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchGet } from "../tokenXFetch";

const getEndpointUtkastForAG = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/utkast`; // TODO

export type UtkastData = {
  lagretUtkast: OppfolgingsplanForm | null;
  sistLagretTid: Date | null;
};

export async function fetchUtkastDataForAG(
  narmesteLederId: string
): Promise<UtkastData> {
  if (isLocalOrDemo) {
    return mockLagretUtkastData;
  }

  const utkastResponse = await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    responseDataSchema: utkastResponseSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });

  // map utkastResponse to OppfolgingsplanForm

  return mockLagretUtkastData;
}

const mockLagretUtkast: OppfolgingsplanForm = {
  typiskArbeidshverdag: null,
  arbeidsoppgaverSomKanUtfores: "utkast tekst",
  arbeidsoppgaverSomIkkeKanUtfores: null,
  tidligereTilrettelegging: null,
  tilretteleggingFremover: null,
  annenTilrettelegging: null,
  hvordanFolgeOpp: null,
  evalueringDato: null,
  harDenAnsatteMedvirket: null,
  denAnsatteHarIkkeMedvirketBegrunnelse: null,
};

const mockLagretUtkastData: UtkastData = {
  lagretUtkast: mockLagretUtkast,
  sistLagretTid: new Date(Date.now() - 30 * 60 * 1000),
};
