import { nanoid } from "nanoid";

const NAV_CONSUMER_ID_REQUEST_HEADER = "syfo-oppfolgingsplan-frontend";

export const getBackendRequestHeaders = (oboToken: string) => ({
  Authorization: `Bearer ${oboToken}`,
  // TODO: hvor er dette dokumentert?
  "Nav-Consumer-Id": NAV_CONSUMER_ID_REQUEST_HEADER,
  // trengs dette? hvor er det dokumentert?
  "Nav-Call-Id": nanoid(),
  "Content-Type": "application/json",
});
