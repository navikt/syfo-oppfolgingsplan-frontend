import { logger } from "@navikt/next-logger";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetchUpdate";

const validateAndGetIdPortenTokenMock = vi.hoisted(() => vi.fn());
const exchangeIdPortenTokenForTokenXOboTokenMock = vi.hoisted(() => vi.fn());

vi.mock("@navikt/next-logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock("@/server/auth/idPortenToken", () => ({
  validateAndGetIdPortenToken: validateAndGetIdPortenTokenMock,
}));

vi.mock("@/server/auth/tokenXExchange", () => ({
  TokenXTargetApi: {
    SYFO_OPPFOLGINGSPLAN_BACKEND: "SYFO_OPPFOLGINGSPLAN_BACKEND",
    FLAGGSKIPET: "FLAGGSKIPET",
    LUMI_API: "LUMI_API",
  },
  exchangeIdPortenTokenForTokenXOboToken:
    exchangeIdPortenTokenForTokenXOboTokenMock,
}));

const responseDataSchema = z.object({
  id: z.string(),
});

const endpoint = "http://flaggskipet/api/v1/tiltakspakker/vurdering";
const loggerErrorMock = vi.mocked(logger.error);

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });
}

describe("tokenXFetchUpdateWithResponse", () => {
  beforeEach(() => {
    validateAndGetIdPortenTokenMock.mockReset();
    exchangeIdPortenTokenForTokenXOboTokenMock.mockReset();
    validateAndGetIdPortenTokenMock.mockResolvedValue("idporten-token");
    exchangeIdPortenTokenForTokenXOboTokenMock.mockResolvedValue("obo-token");
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  test("uses OBO auth headers and forwards the provided AbortSignal", async () => {
    const signal = new AbortController().signal;
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ id: "123" }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await tokenXFetchUpdateWithResponse({
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      requestBody: { orgnumre: ["123456789"] },
      responseDataSchema,
      signal,
    });

    expect(result).toEqual({
      error: null,
      data: { id: "123" },
    });
    expect(validateAndGetIdPortenTokenMock).toHaveBeenCalledOnce();
    expect(exchangeIdPortenTokenForTokenXOboTokenMock).toHaveBeenCalledWith(
      "idporten-token",
      "FLAGGSKIPET",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      endpoint,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ orgnumre: ["123456789"] }),
        signal,
      }),
    );

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headers = requestInit.headers as Record<string, string>;

    expect(headers.Authorization).toBe("Bearer obo-token");
    expect(headers["Nav-Consumer-Id"]).toBe("syfo-oppfolgingsplan-frontend");
    expect(headers["Nav-Call-Id"]).toEqual(expect.any(String));
    expect(headers["Content-Type"]).toBe("application/json");
  });

  test("keeps working when no AbortSignal is provided", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ id: "123" }));
    vi.stubGlobal("fetch", fetchMock);

    await tokenXFetchUpdateWithResponse({
      targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
      endpoint: "http://backend/api/v1/example",
      responseDataSchema,
    });

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;

    expect(requestInit.signal).toBeUndefined();
  });

  test("returns structured error result for non-ok responses", async () => {
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

    const result = await tokenXFetchUpdateWithResponse({
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
    });

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

  test("returns unknown error result with body snippet for unstructured non-ok responses", async () => {
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

    const result = await tokenXFetchUpdateWithResponse({
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
    });

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

  test("returns network error result when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(new Error("Network down")),
    );

    const result = await tokenXFetchUpdateWithResponse({
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
    });

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

  test("returns network error result when fetch is aborted through the provided signal", async () => {
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(controller.signal.reason),
    );

    const result = await tokenXFetchUpdateWithResponse({
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
      signal: controller.signal,
    });

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
      expect.stringContaining("errorName=AbortError"),
    );
  });

  test("returns invalid response error when ok response body does not match schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ ugyldig: true })),
    );

    const result = await tokenXFetchUpdateWithResponse({
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
    });

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

  test("returns invalid response error when ok response contains invalid JSON", async () => {
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

    const result = await tokenXFetchUpdateWithResponse({
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
    });

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
});
