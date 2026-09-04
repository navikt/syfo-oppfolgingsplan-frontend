import { logger } from "@navikt/next-logger";
import { getToken, validateIdportenToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { IdPortenTokenValidationError } from "./authError";
import {
  TokenValidationFailureReason,
  validateAndGetIdPortenToken,
  validateAndGetIdPortenTokenOrRedirectToLogin,
  validateIdPortenToken,
} from "./idPortenToken";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@navikt/oasis", () => ({
  getToken: vi.fn(),
  validateIdportenToken: vi.fn(),
}));

vi.mock("@navikt/next-logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

const PRIVATE_DETAIL = "private-jwt-detail-fnr-12345678901";
const VALID_TOKEN = "valid-token";
const headersMock = vi.mocked(headers);
const getTokenMock = vi.mocked(getToken);
const validateIdportenTokenMock = vi.mocked(validateIdportenToken);
const redirectMock = vi.mocked(redirect);

beforeEach(() => {
  vi.resetAllMocks();
  headersMock.mockResolvedValue(new Headers() as never);
});

describe("validateIdPortenToken", () => {
  test.each([
    undefined,
    null,
  ])("returns a closed missing-token reason for %s", async (token) => {
    getTokenMock.mockReturnValue(token as string | null);

    await expect(validateIdPortenToken()).resolves.toEqual({
      success: false,
      reason: TokenValidationFailureReason.MISSING_TOKEN,
    });
    expectNoLogging();
  });

  test("returns a closed invalid-token reason without Oasis details", async () => {
    getTokenMock.mockReturnValue(VALID_TOKEN);
    validateIdportenTokenMock.mockResolvedValue({
      ok: false,
      errorType: "unknown",
      error: new Error(PRIVATE_DETAIL),
    });

    const result = await validateIdPortenToken();

    expect(result).toEqual({
      success: false,
      reason: TokenValidationFailureReason.INVALID_TOKEN,
    });
    expect(JSON.stringify(result)).not.toContain(PRIVATE_DETAIL);
    expectNoLogging();
  });

  test("sanitizes a thrown Oasis validation failure", async () => {
    getTokenMock.mockReturnValue(VALID_TOKEN);
    validateIdportenTokenMock.mockRejectedValue(new Error(PRIVATE_DETAIL));

    const result = await validateIdPortenToken();

    expect(result).toEqual({
      success: false,
      reason: TokenValidationFailureReason.VALIDATION_ERROR,
    });
    expect(JSON.stringify(result)).not.toContain(PRIVATE_DETAIL);
    expectNoLogging();
  });

  test("sanitizes token extraction failures", async () => {
    getTokenMock.mockImplementation(() => {
      throw new Error(PRIVATE_DETAIL);
    });

    await expect(validateIdPortenToken()).resolves.toEqual({
      success: false,
      reason: TokenValidationFailureReason.VALIDATION_ERROR,
    });
    expectNoLogging();
  });

  test("sanitizes request-header failures", async () => {
    headersMock.mockRejectedValue(new Error(PRIVATE_DETAIL));

    await expect(validateIdPortenToken()).resolves.toEqual({
      success: false,
      reason: TokenValidationFailureReason.VALIDATION_ERROR,
    });
    expect(getTokenMock).not.toHaveBeenCalled();
    expectNoLogging();
  });

  test("returns the token when validation succeeds", async () => {
    getTokenMock.mockReturnValue(VALID_TOKEN);
    validateIdportenTokenMock.mockResolvedValue({
      ok: true,
      payload: {} as never,
    });

    await expect(validateIdPortenToken()).resolves.toEqual({
      success: true,
      token: VALID_TOKEN,
    });
    expectNoLogging();
  });
});

describe("ID-porten token consumers", () => {
  test("leaves the Next.js redirect sentinel untouched for invalid tokens", async () => {
    const redirectSentinel = new Error("NEXT_REDIRECT_SENTINEL");
    getTokenMock.mockReturnValue(VALID_TOKEN);
    validateIdportenTokenMock.mockResolvedValue({
      ok: false,
      errorType: "unknown",
      error: new Error(PRIVATE_DETAIL),
    });
    redirectMock.mockImplementation(() => {
      throw redirectSentinel;
    });

    await expect(
      validateAndGetIdPortenTokenOrRedirectToLogin("/redirect-target"),
    ).rejects.toBe(redirectSentinel);

    expect(redirectMock).toHaveBeenCalledWith(
      "/oauth2/login?redirect=%2Fredirect-target",
    );
    expectNoLogging();
  });

  test("throws a typed technical validation error instead of redirecting", async () => {
    getTokenMock.mockImplementation(() => {
      throw new Error(PRIVATE_DETAIL);
    });

    const rejection = await validateAndGetIdPortenTokenOrRedirectToLogin(
      "/redirect-target",
    ).catch((error: unknown) => error);

    expectSanitizedValidationError(rejection);
    expect(redirectMock).not.toHaveBeenCalled();
    expectNoLogging();
  });

  test("throws a typed update validation error without logging", async () => {
    getTokenMock.mockReturnValue(null);

    const rejection = await validateAndGetIdPortenToken().catch(
      (error: unknown) => error,
    );

    expectSanitizedValidationError(rejection);
    expectNoLogging();
  });
});

function expectSanitizedValidationError(error: unknown): void {
  expect(error).toBeInstanceOf(IdPortenTokenValidationError);
  expect((error as Error).message).toBe("Kunne ikke validere ID-porten-token");
  expect((error as Error).message).not.toContain(PRIVATE_DETAIL);
}

function expectNoLogging(): void {
  expect(logger.warn).not.toHaveBeenCalled();
  expect(logger.error).not.toHaveBeenCalled();
}
