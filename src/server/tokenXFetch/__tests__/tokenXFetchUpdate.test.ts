import { logger } from "@navikt/next-logger";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";
import {
  getRuntimeErrorOperation,
  RuntimeErrorEvent,
} from "@/common/runtimeErrorEvent";
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
  },
  exchangeIdPortenTokenForTokenXOboToken:
    exchangeIdPortenTokenForTokenXOboTokenMock,
}));

const responseDataSchema = z.object({
  id: z.string(),
});

const endpoint = "http://flaggskipet/api/v1/tiltakspakker/vurdering";
const eventType = RuntimeErrorEvent.TILTAKSPAKKEVURDERING_FETCH_FAILED;
const operation = getRuntimeErrorOperation(eventType);
const loggerErrorMock = vi.mocked(logger.error);
const loggerInfoMock = vi.mocked(logger.info);

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
      eventType,
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
      eventType,
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
      eventType,
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
        event_type: eventType,
        operation,
        error_code: "INTERNAL_SERVER_ERROR",
        status: 500,
        method: "POST",
      },
      "TokenX fetch returned a non-OK response",
    );
    expect(loggerErrorMock).toHaveBeenCalledOnce();
    expect(JSON.stringify(loggerErrorMock.mock.calls[0])).not.toContain(
      endpoint,
    );
    expect(JSON.stringify(loggerErrorMock.mock.calls[0])).not.toContain(
      "Noe gikk galt",
    );
  });

  test.each([
    {
      expectedEventType: RuntimeErrorEvent.OPPFOLGINGSPLAN_DEL_MED_LEGE_FAILED,
      expectedErrorCode: "LEGE_NOT_FOUND" as const,
    },
    {
      expectedEventType:
        RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_OVERSIKT_FETCH_FAILED,
      expectedErrorCode: "SYKMELDT_NOT_FOUND" as const,
    },
  ])("keeps expected $expectedErrorCode for its domain operation at info level", async ({
    expectedEventType,
    expectedErrorCode,
  }) => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        jsonResponse(
          {
            type: expectedErrorCode,
            message: "Sensitive backend detail for 12345678901",
          },
          { status: 404, statusText: "Not Found" },
        ),
      ),
    );

    const result = await tokenXFetchUpdateWithResponse({
      eventType: expectedEventType,
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
    });

    expect(result.error).toEqual({
      type: expectedErrorCode,
      message: "Sensitive backend detail for 12345678901",
    });
    expect(loggerErrorMock).not.toHaveBeenCalled();
    expect(loggerInfoMock).toHaveBeenCalledWith(
      {
        event_type: expectedEventType,
        operation: getRuntimeErrorOperation(expectedEventType),
        error_code: expectedErrorCode,
        status: 404,
        method: "POST",
      },
      "TokenX fetch returned a non-OK response",
    );
    expect(loggerInfoMock).toHaveBeenCalledOnce();
    expect(JSON.stringify(loggerInfoMock.mock.calls[0])).not.toContain(
      "12345678901",
    );
    expect(JSON.stringify(loggerInfoMock.mock.calls[0])).not.toContain(
      endpoint,
    );
  });

  test("does not downgrade a domain error code for an unrelated operation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        jsonResponse(
          {
            type: "LEGE_NOT_FOUND",
            message: "Unexpected for this operation",
          },
          { status: 404, statusText: "Not Found" },
        ),
      ),
    );

    await tokenXFetchUpdateWithResponse({
      eventType,
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
    });

    expect(loggerInfoMock).not.toHaveBeenCalled();
    expect(loggerErrorMock).toHaveBeenCalledWith(
      {
        event_type: eventType,
        operation,
        error_code: "LEGE_NOT_FOUND",
        status: 404,
        method: "POST",
      },
      "TokenX fetch returned a non-OK response",
    );
  });

  test("returns unknown error result without logging an unstructured response body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          "ukjent feilbody med fnr=12345678901 og https://example.test/person/42",
          {
            status: 500,
            statusText: "Internal Server Error",
            headers: {
              "Content-Type": "text/plain",
            },
          },
        ),
      ),
    );

    const result = await tokenXFetchUpdateWithResponse({
      eventType,
      targetApi: TokenXTargetApi.FLAGGSKIPET,
      endpoint,
      responseDataSchema,
    });

    expect(result).toEqual({
      error: {
        type: "FETCH_UNKNOWN_ERROR_RESPONSE",
      },
      data: null,
    });
    expect(loggerErrorMock).toHaveBeenCalledWith(
      {
        event_type: eventType,
        operation,
        error_code: "FETCH_UNKNOWN_ERROR_RESPONSE",
        status: 500,
        method: "POST",
      },
      "TokenX fetch returned a non-OK response with an invalid error body",
    );
    expect(loggerErrorMock).toHaveBeenCalledOnce();
    const serializedLogCall = JSON.stringify(loggerErrorMock.mock.calls[0]);
    expect(serializedLogCall).not.toContain("12345678901");
    expect(serializedLogCall).not.toContain("example.test");
    expect(serializedLogCall).not.toContain(endpoint);
  });

  test("returns network error result when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockRejectedValue(
          new Error(
            "Network down for https://example.test/person/42?fnr=12345678901",
          ),
        ),
    );

    const result = await tokenXFetchUpdateWithResponse({
      eventType,
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
        event_type: eventType,
        operation,
        error_code: "FETCH_NETWORK_ERROR",
        exception_type: "Error",
        method: "POST",
      },
      "TokenX fetch failed before receiving a response",
    );
    expect(loggerErrorMock).toHaveBeenCalledOnce();
    const serializedLogCall = JSON.stringify(loggerErrorMock.mock.calls[0]);
    expect(serializedLogCall).not.toContain("12345678901");
    expect(serializedLogCall).not.toContain("example.test");
    expect(serializedLogCall).not.toContain(endpoint);
  });

  test("returns network error result when fetch is aborted through the provided signal", async () => {
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockRejectedValue(controller.signal.reason),
    );

    const result = await tokenXFetchUpdateWithResponse({
      eventType,
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
        event_type: eventType,
        operation,
        error_code: "FETCH_NETWORK_ERROR",
        exception_type: "DOMException",
        method: "POST",
      },
      "TokenX fetch failed before receiving a response",
    );
    expect(loggerErrorMock).toHaveBeenCalledOnce();
  });

  test("returns invalid response error when ok response body does not match schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ ugyldig: true })),
    );

    const result = await tokenXFetchUpdateWithResponse({
      eventType,
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
      {
        event_type: eventType,
        operation,
        error_code: "OK_RESPONSE_BUT_RESPONSE_BODY_INVALID",
        status: 200,
        method: "POST",
      },
      "TokenX fetch returned an invalid success response body",
    );
    expect(loggerErrorMock).toHaveBeenCalledOnce();
    expect(JSON.stringify(loggerErrorMock.mock.calls[0])).not.toContain(
      endpoint,
    );
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
      eventType,
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
      {
        event_type: eventType,
        operation,
        error_code: "OK_RESPONSE_BUT_RESPONSE_BODY_INVALID",
        status: 200,
        method: "POST",
      },
      "TokenX fetch returned an invalid success response body",
    );
    expect(loggerErrorMock).toHaveBeenCalledOnce();
    const serializedLogCall = JSON.stringify(loggerErrorMock.mock.calls[0]);
    expect(serializedLogCall).not.toContain("ikke json");
    expect(serializedLogCall).not.toContain(endpoint);
  });
});
