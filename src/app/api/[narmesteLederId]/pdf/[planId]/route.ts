import { getEndpointPDFForAG } from "@/common/backend-endpoints.ts";
import { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import { isLocalOrDemo } from "@/env-variables/envHelpers.ts";
import { validateAndGetIdPortenToken } from "@/server/auth/idPortenToken";
import {
  exchangeIdPortenTokenForTokenXOboToken,
  TokenXTargetApi,
} from "@/server/auth/tokenXExchange";
import { mockPdf } from "@/server/fetchData/mockData/mockPdf.ts";
import { getAndLogAuthenticationErrorResult } from "@/server/tokenXFetch/errorHandling";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ narmesteLederId: string; planId: string }> },
) {
  if (isLocalOrDemo) {
    return mockPdf();
  }

  const { narmesteLederId, planId } = await params;

  let oboToken: string;
  try {
    const idportenToken = await validateAndGetIdPortenToken();
    oboToken = await exchangeIdPortenTokenForTokenXOboToken(
      idportenToken,
      TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    );
  } catch (error) {
    const errorResult = getAndLogAuthenticationErrorResult({
      error,
      eventType:
        RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_PDF_FETCH_FAILED,
      method: "GET",
    });
    if (errorResult) {
      throw errorResult;
    }
    throw error;
  }

  const res = await fetch(getEndpointPDFForAG(narmesteLederId, planId), {
    headers: {
      Authorization: `Bearer ${oboToken}`,
    },
  });

  const headers = new Headers();
  headers.append("Content-Type", "application/pdf");
  headers.append(
    "Content-Disposition",
    'inline; filename="oppfolgingsplan.pdf"',
  );

  const data = await res.blob();
  return new Response(data, { headers });
}
