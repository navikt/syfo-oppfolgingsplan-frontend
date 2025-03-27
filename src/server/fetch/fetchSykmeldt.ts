"use server";

import { getServerEnv, isLocalOrDemo, publicEnv } from "@/constants/envs";
import { Sykmeldt, sykmeldtSchema } from "@/schema/sykmeldtSchema";
import { authenticatedFetch } from "@/server/authenticatedFetch";
import { validateIdPortenToken } from "@/auth/validateIdPortenToken";
import { logger } from "@navikt/next-logger";

export async function fetchSykmeldt(
  narmestelederid: string,
): Promise<Sykmeldt> {
  if (isLocalOrDemo) {
    logger.info(
      publicEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT +
        " Running in local or demo mode, returning mock data",
    );
    return {
      narmestelederId: narmestelederid,
      orgnummer: "110110110",
      fnr: "110110110110",
      navn: "Kreativ Hatt",
      aktivSykmelding: true,
    };
  }

  const validatedIdPortenToken = await validateIdPortenToken();
  if (!validatedIdPortenToken) {
    throw new Error("Idporten token is not valid");
  }

  const result = await authenticatedFetch({
    method: "GET",
    endpoint: `${getServerEnv().DINESYKMELDTE_BACKEND_HOST}/api/v2/dinesykmeldte/${narmestelederid}`,
    clientId: getServerEnv().DINESYKMELDTE_BACKEND_CLIENT_ID,
    idportenToken: validatedIdPortenToken,
    schema: sykmeldtSchema,
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}
