import { beforeEach, describe, expect, test, vi } from "vitest";
import { RuntimeErrorEvent } from "@/common/runtimeErrorEvent";

const mocks = vi.hoisted(() => ({
  getAndLogErrorResultFromNonOkResponse: vi.fn(),
  getAndLogFetchNetworkError: vi.fn(),
  logPdfResponseBodyReadError: vi.fn(),
}));

vi.mock("../errorHandling", () => mocks);

import { fetchPdfResponse } from "../fetchPdfResponse";

const eventType =
  RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_PDF_FETCH_FAILED;
const endpoint = "https://backend.example.test/pdf/12345678901";
const oboToken = "obo-token-canary";
const fetchMock = vi.fn<typeof fetch>();

describe("fetchPdfResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  test("returns a successful PDF with download headers", async () => {
    fetchMock.mockResolvedValue(new Response("pdf-content", { status: 200 }));

    const response = await fetchPdfResponse({
      endpoint,
      oboToken,
      eventType,
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe(
      'inline; filename="oppfolgingsplan.pdf"',
    );
    expect(await response.text()).toBe("pdf-content");
    expect(fetchMock).toHaveBeenCalledWith(endpoint, {
      headers: { Authorization: `Bearer ${oboToken}` },
    });
  });

  test("returns 502 and logs a network failure", async () => {
    const error = new TypeError(`failed for ${endpoint} with ${oboToken}`);
    fetchMock.mockRejectedValue(error);

    const response = await fetchPdfResponse({
      endpoint,
      oboToken,
      eventType,
    });

    expect(response.status).toBe(502);
    expect(mocks.getAndLogFetchNetworkError).toHaveBeenCalledWith({
      error,
      eventType,
      method: "GET",
    });
  });

  test("propagates a non-OK upstream status without its body", async () => {
    const upstreamResponse = new Response("private backend body", {
      status: 503,
    });
    fetchMock.mockResolvedValue(upstreamResponse);

    const response = await fetchPdfResponse({
      endpoint,
      oboToken,
      eventType,
    });

    expect(response.status).toBe(503);
    expect(await response.text()).toBe("");
    expect(mocks.getAndLogErrorResultFromNonOkResponse).toHaveBeenCalledWith({
      eventType,
      response: upstreamResponse,
      method: "GET",
    });
  });

  test("returns 502 when an OK PDF body cannot be read", async () => {
    const error = new Error(`body failed for ${endpoint} with ${oboToken}`);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      arrayBuffer: vi.fn().mockRejectedValue(error),
    } as unknown as Response);

    const response = await fetchPdfResponse({
      endpoint,
      oboToken,
      eventType,
    });

    expect(response.status).toBe(502);
    expect(mocks.logPdfResponseBodyReadError).toHaveBeenCalledWith({
      error,
      eventType,
      upstreamStatus: 200,
    });
  });
});
