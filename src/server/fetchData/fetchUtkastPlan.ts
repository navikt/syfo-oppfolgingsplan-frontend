import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { utkastResponseSchema } from "@/schema/formSnapshot-schema";
import { OppfolgingsplanForm } from "@/schema/oppfolgingsplanFormSchemas";
import { TokenXTargetApi } from "../helpers";
import { tokenXFetchGet } from "../tokenXFetch";

const getEndpointUtkastForAG = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/utkast`; // TODO

export async function fetchUtkastPlanForAGAndMapToPrefill(
  narmesteLederId: string
): Promise<Partial<OppfolgingsplanForm> | null> {
  if (isLocalOrDemo) {
    return {
      annenTilrettelegging: "utkast tekst",
    }; //TODO
  }

  const utkastResponse = await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointUtkastForAG(narmesteLederId),
    responseDataSchema: utkastResponseSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmesteLederId),
  });

  // map utkastResponse to OppfolgingsplanForm

  return {
    annenTilrettelegging: "utkast tekst",
  };
}
