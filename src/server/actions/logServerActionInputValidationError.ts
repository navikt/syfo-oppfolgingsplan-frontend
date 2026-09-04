import "server-only";
import { logger } from "@navikt/next-logger";
import type { ZodError, ZodType } from "zod";
import {
  getRuntimeErrorOperation,
  type RuntimeErrorEvent,
} from "@/common/runtimeErrorEvent";
import { getSafeZodIssues } from "@/server/safeZodIssues";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";

export type InputValidationTarget =
  | "narmeste_leder_id"
  | "payload"
  | "narmeste_leder_id_and_payload";

/** Logs bounded Zod codes and paths; rejected input and validation messages stay out. */
export function logServerActionInputValidationError({
  eventType,
  validationTarget,
  validationError,
  validationSchema,
}: {
  eventType: RuntimeErrorEvent;
  validationTarget: InputValidationTarget;
  validationError?: ZodError;
  validationSchema?: ZodType;
}) {
  logger.error(
    {
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR,
      validation_target: validationTarget,
      ...(validationError === undefined || validationSchema === undefined
        ? {}
        : {
            validation_issues: getSafeZodIssues(
              validationError,
              validationSchema,
            ),
            validation_issue_count: validationError.issues.length,
          }),
    },
    "Server action input validation failed",
  );
}
