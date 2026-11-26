import { logger } from "@navikt/next-logger";
import { isLocalOrDemo } from "@/env-variables/envHelpers";

/**
 * Accepts Lumi survey answers in local and demo only, without forwarding them.
 * To store answers in dev and prod, this route must exchange the user's token
 * with TokenX and forward the payload to Lumi API. That also needs Nais config
 * and inbound access from Team eSyfo:
 * https://navikt.github.io/lumi/kom-i-gang/koble-til-backend
 */
export async function POST(request: Request): Promise<Response> {
  if (!isLocalOrDemo) {
    return new Response(null, { status: 404 });
  }

  try {
    await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  logger.info("Received Lumi feedback in local or demo. It is not forwarded.");
  return Response.json({ id: "mock-feedback-id" }, { status: 201 });
}
