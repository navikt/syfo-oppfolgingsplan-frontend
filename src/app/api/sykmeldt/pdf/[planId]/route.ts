import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { validateAndGetIdPortenToken } from "@/server/auth/idPortenToken";
import {
  exchangeIdPortenTokenForTokenXOboToken,
  TokenXTargetApi,
} from "@/server/auth/tokenXExchange";
import { mockPdf } from "@/server/fetchData/mockData/mockPdf";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  if (isLocalOrDemo) {
    return mockPdf();
  }

  const { planId } = await params;

  const idportenToken = await validateAndGetIdPortenToken();
  const oboToken = await exchangeIdPortenTokenForTokenXOboToken(
    idportenToken,
    TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
  );

  const res = await fetch(
    `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/sykmeldt/oppfolgingsplaner/${planId}/pdf`,
    {
      headers: {
        Authorization: `Bearer ${oboToken}`,
      },
    },
  );

  const headers = new Headers();
  headers.append("Content-Type", "application/pdf");
  headers.append(
    "Content-Disposition",
    'inline; filename="oppfolgingsplan.pdf"',
  );

  const data = await res.blob();
  return new Response(data, { headers });
}
