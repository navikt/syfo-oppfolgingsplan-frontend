import { afterEach, describe, expect, test, vi } from "vitest";
import { mockFlaggskipetVurderingTiltaksgruppe } from "@/server/fetchData/mockData/mockFlaggskipetVurdering";

const flaggskipetHost = "http://flaggskipet";

async function importFetcher({ isLocalOrDemo }: { isLocalOrDemo: boolean }) {
  vi.resetModules();
  vi.doMock("@/env-variables/envHelpers", () => ({
    isLocalOrDemo,
  }));
  vi.doMock("@/env-variables/serverEnv", () => ({
    getServerEnv: () => ({
      FLAGGSKIPET_HOST: flaggskipetHost,
    }),
  }));

  return await import("../fetchTiltakspakkeVurdering");
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });
}

describe("fetchTiltakspakkeVurdering", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.resetModules();
    vi.doUnmock("@/env-variables/envHelpers");
    vi.doUnmock("@/env-variables/serverEnv");
  });

  test("sends POST request to Flaggskipet with only orgnumre, timeout signal and no Authorization header", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(mockFlaggskipetVurderingTiltaksgruppe));
    vi.stubGlobal("fetch", fetchMock);
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering("123456789");

    expect(result).toEqual({
      error: null,
      data: mockFlaggskipetVurderingTiltaksgruppe,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${flaggskipetHost}/api/v1/tiltakspakker/vurdering`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ orgnumre: ["123456789"] }),
      }),
    );
    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = requestInit.headers as Record<string, string>;

    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["Nav-Consumer-Id"]).toBe("syfo-oppfolgingsplan-frontend");
    expect(headers["Nav-Call-Id"]).toEqual(expect.any(String));
    expect(headers.Authorization).toBeUndefined();
    expect(requestInit.signal).toBeInstanceOf(AbortSignal);
  });

  test("returns error result when Flaggskipet responds with non-ok status", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          jsonResponse(
            { type: "INTERNAL_SERVER_ERROR", message: "Noe gikk galt" },
            { status: 500, statusText: "Internal Server Error" },
          ),
        ),
    );
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering("123456789");

    expect(result).toEqual({
      error: {
        type: "INTERNAL_SERVER_ERROR",
        message: "Noe gikk galt",
      },
      data: null,
    });
  });

  test("returns network error result when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(new Error("Network down")),
    );
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering("123456789");

    expect(result).toEqual({
      error: {
        type: "FETCH_NETWORK_ERROR",
      },
      data: null,
    });
  });

  test("returns network error result when Flaggskipet times out", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockRejectedValue(new DOMException("Timed out", "TimeoutError")),
    );
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering("123456789");

    expect(result).toEqual({
      error: {
        type: "FETCH_NETWORK_ERROR",
      },
      data: null,
    });
  });

  test("returns invalid response error when Flaggskipet response does not match schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ ugyldig: true })),
    );
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering("123456789");

    expect(result).toEqual({
      error: {
        type: "OK_RESPONSE_BUT_RESPONSE_BODY_INVALID",
      },
      data: null,
    });
  });

  test("returns invalid response error when Flaggskipet responds with invalid JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response("ikke json", {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ),
    );
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering("123456789");

    expect(result).toEqual({
      error: {
        type: "OK_RESPONSE_BUT_RESPONSE_BODY_INVALID",
      },
      data: null,
    });
  });

  test.each([
    "",
    "12345",
    "abcdefghi",
  ])("does not call Flaggskipet for invalid orgnummer '%s'", async (orgnummer) => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: false,
    });

    const result = await fetchTiltakspakkeVurdering(orgnummer);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: {
        type: "SERVER_ACTION_INPUT_VALIDATION_ERROR",
      },
      data: null,
    });
  });

  test("returns mock data in local or demo without calling Flaggskipet", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    const { fetchTiltakspakkeVurdering } = await importFetcher({
      isLocalOrDemo: true,
    });

    const result = await fetchTiltakspakkeVurdering("123456789");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: null,
      data: mockFlaggskipetVurderingTiltaksgruppe,
    });
  });
});
