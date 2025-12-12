import { Alert } from "@navikt/ds-react";
import { FetchResultError } from "@/server/tokenXFetch/FetchResult.ts";
import { getFetchResultErrorMessage } from "@/ui-helpers/error-messages.ts";

export function FetchErrorAlert({ error }: { error: FetchResultError | null }) {
  if (!error) return null;
  return <Alert variant="error">{getFetchResultErrorMessage(error)}</Alert>;
}
