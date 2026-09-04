import { logger } from "@navikt/next-logger";
import { requestOboToken } from "@navikt/oasis";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getServerEnv } from "@/env-variables/serverEnv";
import { TokenXExchangeError } from "./authError";
import {
  exchangeIdPortenTokenForTokenXOboToken,
  TokenXTargetApi,
} from "./tokenXExchange";

vi.mock("@navikt/next-logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock("@navikt/oasis", () => ({
  requestOboToken: vi.fn(),
}));

vi.mock("@/env-variables/serverEnv", () => ({
  getServerEnv: vi.fn(),
}));

const PRIVATE_DETAIL = "private-token-error-fnr-12345678901";
const requestOboTokenMock = vi.mocked(requestOboToken);
const getServerEnvMock = vi.mocked(getServerEnv);

beforeEach(() => {
  vi.resetAllMocks();
  getServerEnvMock.mockReturnValue({
    SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID: "backend-client-id",
    FLAGGSKIPET_CLIENT_ID: "flaggskipet-client-id",
  } as never);
});

describe("exchangeIdPortenTokenForTokenXOboToken", () => {
  test("returns the exchanged token without logging", async () => {
    requestOboTokenMock.mockResolvedValue({ ok: true, token: "obo-token" });

    await expect(
      exchangeIdPortenTokenForTokenXOboToken(
        "idporten-token",
        TokenXTargetApi.FLAGGSKIPET,
      ),
    ).resolves.toBe("obo-token");

    expect(requestOboTokenMock).toHaveBeenCalledWith(
      "idporten-token",
      "flaggskipet-client-id",
    );
    expectNoLogging();
  });

  test("throws a sanitized typed error for an unsuccessful exchange", async () => {
    requestOboTokenMock.mockResolvedValue({
      ok: false,
      error: new Error(PRIVATE_DETAIL),
    });

    const rejection = await exchangeIdPortenTokenForTokenXOboToken(
      "idporten-token",
      TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    ).catch((error: unknown) => error);

    expectSanitizedExchangeError(rejection);
    expectNoLogging();
  });

  test("wraps a thrown exchange failure without leaking its message", async () => {
    requestOboTokenMock.mockRejectedValue(new Error(PRIVATE_DETAIL));

    const rejection = await exchangeIdPortenTokenForTokenXOboToken(
      "idporten-token",
      TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    ).catch((error: unknown) => error);

    expectSanitizedExchangeError(rejection);
    expectNoLogging();
  });
});

function expectSanitizedExchangeError(error: unknown): void {
  expect(error).toBeInstanceOf(TokenXExchangeError);
  expect((error as Error).message).toBe("Kunne ikke hente TokenX-token");
  expect((error as Error).message).not.toContain(PRIVATE_DETAIL);
}

function expectNoLogging(): void {
  expect(logger.warn).not.toHaveBeenCalled();
  expect(logger.error).not.toHaveBeenCalled();
}
