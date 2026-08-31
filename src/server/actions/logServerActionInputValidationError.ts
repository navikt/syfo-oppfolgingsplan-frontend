import "server-only";
import { logger } from "@navikt/next-logger";
import {
  getRuntimeErrorOperation,
  type RuntimeErrorEvent,
} from "@/common/runtimeErrorEvent";
import { FrontendErrorType } from "./FrontendErrorTypeEnum";

export type InputValidationTarget =
  | "narmeste_leder_id"
  | "payload"
  | "narmeste_leder_id_and_payload";

/** Logs only bounded field names; rejected input and validation messages stay out. */
export function logServerActionInputValidationError({
  eventType,
  validationTarget,
}: {
  eventType: RuntimeErrorEvent;
  validationTarget: InputValidationTarget;
}) {
  logger.error(
    {
      event_type: eventType,
      operation: getRuntimeErrorOperation(eventType),
      error_code: FrontendErrorType.SERVER_ACTION_INPUT_VALIDATION_ERROR,
      validation_target: validationTarget,
    },
    "Server action input validation failed",
  );
}
