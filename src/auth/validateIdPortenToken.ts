import { logger } from "@navikt/next-logger";
import { getToken, validateIdportenToken } from "@navikt/oasis";
import { headers } from "next/headers";

export const validateIdPortenToken = async (): Promise<string | null> => {
  const headersList = await headers();
  const idportenToken = getToken(headersList);

  if (!idportenToken) {
    logger.warn("Missing idporten token");
    return null;
  }

  const validationResult = await validateIdportenToken(idportenToken);
  if (!validationResult.ok) {
    logger.warn(
      `Invalid JWT token found, cause: ${validationResult.errorType} ${validationResult.error}`,
    );
    return null;
  }

  return idportenToken;
};
