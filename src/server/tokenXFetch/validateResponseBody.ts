import { logger } from "@navikt/next-logger";
import type z from "zod";
import { tryToExtractNameAndMessageFromError } from "./errorHandling";

/**
 * Returns validation result, and logs error if validation fails.
 */
export async function validateResponseBody<S extends z.ZodType>({
  response,
  responseDataSchema,
  endpoint,
  method,
}: {
  response: Response;
  endpoint: string;
  method: string;
  responseDataSchema: S;
}): Promise<
  | {
      success: true;
      validatedData: z.infer<S>;
    }
  | {
      success: false;
      validatedData: null;
    }
> {
  try {
    const responseData = await response.json();
    const validatedData = responseDataSchema.parse(responseData);
    return {
      success: true,
      validatedData,
    };
  } catch (err) {
    // Response data is invalid
    const { errorName, message } = tryToExtractNameAndMessageFromError(err);
    logger.error(
      `Got invalid response data from ${method} ${endpoint}: name=${errorName} message=${message}`,
    );

    return {
      success: false,
      validatedData: null,
    };
  }
}
