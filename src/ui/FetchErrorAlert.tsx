import { Alert } from "@navikt/ds-react";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult";
import { getFetchResultErrorMessage } from "@/ui-helpers/error-messages";

interface FetchErrorAlertProps {
  /**
   * The error object returned from a server action or fetch.
   * If null, the component renders nothing.
   */
  error: FetchResultError | null;
  /**
   * Optional override for generic errors (e.g. 500, 404).
   * Specific errors (like LEGE_NOT_FOUND) will ignore this and show their specific message.
   */
  customGeneralMessage?: string;
  /** Optional CSS class for custom styling. */
  className?: string;
}

/**
 * Standardized error display for backend fetch operations.
 * Automatically resolves the correct user-facing message based on the error type.
 */
export function FetchErrorAlert({
  error,
  customGeneralMessage,
  className,
}: FetchErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert variant="error" className={className}>
      {getFetchResultErrorMessage(error, customGeneralMessage)}
    </Alert>
  );
}
