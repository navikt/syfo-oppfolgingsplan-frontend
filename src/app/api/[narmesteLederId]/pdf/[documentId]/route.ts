import { getEndpointPDFForAG } from "@/common/backend-endpoints.ts";
import { TokenXTargetApi } from "@/server/helpers.ts";
import {
  exchangeIdPortenTokenForTokenXOboToken,
  validateAndGetIdPortenToken,
} from "@/server/tokenXFetch.ts";

export async function GET(
  _: Request,
  {
    params,
  }: { params: Promise<{ narmesteLederId: string; documentId: string }> },
) {
  const { narmesteLederId, documentId } = await params;
  console.log("testing");
  const idportenToken = await validateAndGetIdPortenToken();
  const oboToken = await exchangeIdPortenTokenForTokenXOboToken(
    idportenToken,
    TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
  );

  const res = await fetch(getEndpointPDFForAG(narmesteLederId, documentId), {
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
  return new Response(data, {});
}
