"use server";

import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { Sykmeldt, sykmeldtSchema } from "@/schema/sykmeldtSchema";
import { authenticatedFetch } from "@/server/authenticatedFetch";
import { FetchResult } from "@/server/FetchResult";

export async function fetchSykmeldt(
  narmestelederid: string
): Promise<FetchResult<Sykmeldt>> {
  if (isLocalOrDemo) {
    return {
      success: true,
      data: {
        narmestelederId: narmestelederid,
        orgnummer: "110110110",
        fnr: "110110110110",
        navn: "Kreativ Hatt",
        aktivSykmelding: true,
      },
    };
  }

  return await authenticatedFetch({
    method: "GET",
    endpoint: `${getServerEnv().DINESYKMELDTE_BACKEND_HOST}/api/v2/dinesykmeldte/${narmestelederid}`,
    clientId: getServerEnv().DINESYKMELDTE_BACKEND_CLIENT_ID,
    schema: sykmeldtSchema,
  });
}
