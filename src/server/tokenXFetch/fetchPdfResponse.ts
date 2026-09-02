import type { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";
import {
  getAndLogErrorResultFromNonOkResponse,
  getAndLogFetchNetworkError,
  logPdfResponseBodyReadError,
} from "./errorHandling";

export async function fetchPdfResponse({
  endpoint,
  oboToken,
  eventType,
}: {
  endpoint: string;
  oboToken: string;
  eventType: RuntimeErrorEvent;
}): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${oboToken}` },
    });
  } catch (error) {
    getAndLogFetchNetworkError({ error, eventType, method: "GET" });
    return new Response(null, { status: 502 });
  }

  if (!response.ok) {
    await getAndLogErrorResultFromNonOkResponse({
      eventType,
      response,
      method: "GET",
    });
    return new Response(null, { status: response.status });
  }

  let data: ArrayBuffer;
  try {
    data = await response.arrayBuffer();
  } catch (error) {
    logPdfResponseBodyReadError({
      error,
      eventType,
      upstreamStatus: response.status,
    });
    return new Response(null, { status: 502 });
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/pdf");
  headers.append(
    "Content-Disposition",
    'inline; filename="oppfolgingsplan.pdf"',
  );

  return new Response(data, { headers });
}
