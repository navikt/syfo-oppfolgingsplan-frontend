import { logger } from "@navikt/next-logger";
import type z from "zod";
import {
  getRuntimeErrorOperation,
  type RuntimeErrorEvent,
  type RuntimeErrorHttpMethod,
} from "@/common/runtimeErrorEvent";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";

/**
 * Returns validation result, and logs error if validation fails.
 */
export async function validateResponseBody<S extends z.ZodType>({
  eventType,
  response,
  responseDataSchema,
  method,
}: {
  eventType: RuntimeErrorEvent;
  response: Response;
  method: RuntimeErrorHttpMethod;
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
  } catch {
    // Response data is invalid
    logger.error(
      {
        event_type: eventType,
        operation: getRuntimeErrorOperation(eventType),
        error_code: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
        upstream_status: response.status,
        method,
      },
      "TokenX fetch returned an invalid success response body",
    );

    return {
      success: false,
      validatedData: null,
    };
  }
}
