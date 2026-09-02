import { logger } from "@navikt/next-logger";
import type z from "zod";
import {
  getRuntimeErrorOperation,
  type RuntimeErrorEvent,
  type RuntimeErrorHttpMethod,
} from "@/common/runtimeErrorEvent";
import { FrontendErrorType } from "../actions/FrontendErrorTypeEnum";
import { getSafeZodIssues } from "../safeZodIssues";
import { getSafeExceptionType } from "./errorHandling";

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
  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch (error) {
    logger.error(
      {
        event_type: eventType,
        operation: getRuntimeErrorOperation(eventType),
        error_code: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
        upstream_status: response.status,
        method,
        validation_stage: "json_parse",
        exception_type: getSafeExceptionType(error),
      },
      "TokenX fetch returned invalid JSON in a success response",
    );

    return {
      success: false,
      validatedData: null,
    };
  }

  const validationResult = responseDataSchema.safeParse(responseData);
  if (!validationResult.success) {
    logger.error(
      {
        event_type: eventType,
        operation: getRuntimeErrorOperation(eventType),
        error_code: FrontendErrorType.OK_RESPONSE_BUT_RESPONSE_BODY_INVALID,
        upstream_status: response.status,
        method,
        validation_stage: "schema",
        validation_issues: getSafeZodIssues(
          validationResult.error,
          responseDataSchema,
        ),
        validation_issue_count: validationResult.error.issues.length,
      },
      "TokenX fetch success response did not match schema",
    );

    return {
      success: false,
      validatedData: null,
    };
  }

  return {
    success: true,
    validatedData: validationResult.data,
  };
}
