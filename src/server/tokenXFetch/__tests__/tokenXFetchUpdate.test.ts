import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";
import { TokenXTargetApi } from "@/server/auth/tokenXExchange";
import { tokenXFetchUpdateWithResponse } from "../tokenXFetchUpdate";

const validateAndGetIdPortenTokenMock = vi.hoisted(() => vi.fn());
const exchangeIdPortenTokenForTokenXOboTokenMock = vi.hoisted(() => vi.fn());

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
});
