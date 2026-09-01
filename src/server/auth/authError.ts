export class IdPortenTokenValidationError extends Error {
  constructor() {
    super("Kunne ikke validere ID-porten-token");
    this.name = "IdPortenTokenValidationError";
  }
}

export function isIdPortenTokenValidationError(
  error: unknown,
): error is IdPortenTokenValidationError {
  return error instanceof IdPortenTokenValidationError;
}

export class TokenXExchangeError extends Error {
  constructor() {
    super("Kunne ikke hente TokenX-token");
    this.name = "TokenXExchangeError";
  }
}

export function isTokenXExchangeError(
  error: unknown,
): error is TokenXExchangeError {
  return error instanceof TokenXExchangeError;
}
