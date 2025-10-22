import { logger } from "@navikt/next-logger";
import { getServerEnv } from "@/env-variables/serverEnv";

export async function GET() {
  try {
    getServerEnv();
  } catch (e) {
    logger.error(e);
    return Response.json({ message: "I am not ready :(" }, { status: 500 });
  }

  return Response.json({ message: "I am ready :)" });
}
