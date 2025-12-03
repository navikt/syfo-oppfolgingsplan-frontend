import { getEndpointPDFForAG } from "@/common/backend-endpoints.ts";
import { isLocalOrDemo } from "@/env-variables/envHelpers.ts";
import { mockPdf } from "@/server/fetchData/mockData/mockPdf.ts";
import { TokenXTargetApi } from "@/server/helpers.ts";
import {
  exchangeIdPortenTokenForTokenXOboToken,
  validateAndGetIdPortenToken,
} from "@/server/tokenXFetch.ts";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ narmesteLederId: string; planId: string }> },
) {
  if (isLocalOrDemo) {
    return mockPdf();
  }

  const { narmesteLederId, planId } = await params;

  const idportenToken = await validateAndGetIdPortenToken();
  const oboToken = await exchangeIdPortenTokenForTokenXOboToken(
    idportenToken,
    TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
  );

  const res = await fetch(getEndpointPDFForAG(narmesteLederId, planId), {
    headers: {
      Authorization: `Bearer ${oboToken}`,
    },
  });

  const headers = new Headers();
  headers.append("Content-Type", "application/pdf");
  headers.append(
    "Content-Disposition",
    'attachment; filename="oppfolgingsplan.pdf"',
  );

  const data = await res.blob();
  return new Response(data, { headers });
}
