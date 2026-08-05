import { logger } from "@navikt/next-logger";
import { afterEach, describe, expect, test, vi } from "vitest";
import { mockFlaggskipetVurderingTiltaksgruppe } from "@/server/fetchData/mockData/mockFlaggskipetVurdering";

vi.mock("@navikt/next-logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const flaggskipetHost = "http://flaggskipet";
const endpoint = `${flaggskipetHost}/api/v1/tiltakspakker/vurdering`;
const loggerErrorMock = vi.mocked(logger.error);

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
    vi.clearAllMocks();
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
      endpoint,
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
    expect(loggerErrorMock).toHaveBeenCalledWith(
      {
        type: "INTERNAL_SERVER_ERROR",
        message: "Noe gikk galt",
        method: "POST",
        endpoint,
      },
      expect.stringContaining(`fetch to POST ${endpoint}`),
    );
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
    expect(loggerErrorMock).toHaveBeenCalledWith(
      {
        type: "FETCH_NETWORK_ERROR",
        method: "POST",
        endpoint,
      },
      expect.stringContaining(
        `Unexpected network error on fetch to POST ${endpoint}: errorName=Error message=Network down`,
      ),
    );
  });

  test("returns network error result when Flaggskipet times out", async () => {
    const timeoutSignal = AbortSignal.timeout(0);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const timeoutError = timeoutSignal.reason;

    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(timeoutError),
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
    expect(loggerErrorMock).toHaveBeenCalledWith(
      {
        type: "FETCH_NETWORK_ERROR",
        method: "POST",
        endpoint,
      },
      expect.stringContaining(
        `Unexpected network error on fetch to POST ${endpoint}: errorName=TimeoutError message=The operation was aborted due to timeout`,
      ),
    );
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
    expect(loggerErrorMock).toHaveBeenCalledWith(
      expect.stringContaining(
        `Got invalid response data from POST ${endpoint}: name=`,
      ),
    );
    expect(loggerErrorMock.mock.calls[0]?.[0]).toContain("message=");
  });

  test("returns unknown error response when Flaggskipet responds with unrecognized non-ok body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response("ukjent feilbody fra flaggskipet", {
          status: 500,
          statusText: "Internal Server Error",
          headers: {
            "Content-Type": "text/plain",
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
        type: "FETCH_UNKOWN_ERROR_RESPONSE",
      },
      data: null,
    });
    expect(loggerErrorMock).toHaveBeenCalledWith(
      {
        type: "FETCH_UNKOWN_ERROR_RESPONSE",
        method: "POST",
        endpoint,
      },
      expect.stringContaining("body=ukjent feilbody fra flaggskipet"),
    );
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
    expect(loggerErrorMock).toHaveBeenCalledWith(
      expect.stringContaining(
        `Got invalid response data from POST ${endpoint}: name=`,
      ),
    );
    expect(loggerErrorMock.mock.calls[0]?.[0]).toContain("message=");
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
