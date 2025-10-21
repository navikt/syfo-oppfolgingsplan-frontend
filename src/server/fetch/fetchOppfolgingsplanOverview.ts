import {
  OppfolgingsplanOverview,
  oppfolgingsplanOverviewSchema,
} from "@/schema/oppfolgingsplanSchema.ts";
import { FetchResult } from "@/server/FetchResult.ts";
import { authenticatedFetch } from "@/server/authenticatedFetch.ts";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";

const demoOverview: FetchResult<OppfolgingsplanOverview> = {
  success: true,
  data: {
    utkast: {
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      sykmeldtFnr: "01010112345",
      narmesteLederFnr: "01010154321",
      organisasjonsnummer: "987654321",
      evalueringsdato: null,
    },
    oppfolgingsplan: {
      uuid: "223e4567-e89b-12d3-a456-426614174000",
      sykmeldtFnr: "01010112345",
      narmesteLederFnr: "01010154321",
      organisasjonsnummer: "987654321",
      evalueringsdato: "2024-12-31",
      skalDelesMedVeileder: true,
      deltMedVeilederTidspunkt: "2024-01-15T10:00:00Z",
      skalDelesMedLege: false,
      deltMedLegeTidspunkt: "2024-01-20T14:30:00Z",
      createdAt: "2024-01-01T09:00:00Z",
    },
    previousOppfolgingsplaner: [],
  },
};

export async function fetchOppfolgingsplanOverviewForArbeidsgiver(
  narmesteLederId: string
): Promise<FetchResult<OppfolgingsplanOverview>> {
  if (isLocalOrDemo) {
    return demoOverview;
  }
  return await authenticatedFetch({
    method: "GET",
    endpoint: `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/oppfolgingsplaner/oversikt`,
    clientId: getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID,
    schema: oppfolgingsplanOverviewSchema,
  });
}
