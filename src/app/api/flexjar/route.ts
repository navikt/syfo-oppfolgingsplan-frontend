import { NextRequest, NextResponse } from "next/server";
import { FlexJarTransportPayload } from "@navikt/flexjar-widget";
import { logger } from "@navikt/next-logger";
import { requestOboToken } from "@navikt/oasis";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import { validateAndGetIdPortenToken } from "@/server/auth/idPortenToken.ts";

async function exchangeToken(idportenToken: string): Promise<string> {
  const { FLEXJAR_BACKEND_CLIENT_ID } = getServerEnv();
  const tokenxGrant = await requestOboToken(
    idportenToken,
    FLEXJAR_BACKEND_CLIENT_ID,
  );
  if (!tokenxGrant.ok) {
    logger.error(
      `Unable to exchange token for FLEXJAR backend client \`${FLEXJAR_BACKEND_CLIENT_ID}\`, reason: ${tokenxGrant.error.message}`,
    );
    throw new Error("Token exchange failed");
  }
  return tokenxGrant.token;
}

export async function POST(req: NextRequest) {
  if (isLocalOrDemo) {
    return NextResponse.json({ id: "123" }, { status: 200 });
  }

  const payload: FlexJarTransportPayload = await req.json();
  const idportenToken = await validateAndGetIdPortenToken();
  const exchangedToken = await exchangeToken(idportenToken);

  const url = new URL("/api/v2/feedback", getServerEnv().FLEXJAR_HOST);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${exchangedToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    logger.error(`Flexjar backend error (${res.status}): ${body}`);
    return NextResponse.json(
      { message: "Failed to submit feedback", error: body },
      { status: res.status },
    );
  }

  const json = await res.json();
  return NextResponse.json(json, { status: 200 });
}
