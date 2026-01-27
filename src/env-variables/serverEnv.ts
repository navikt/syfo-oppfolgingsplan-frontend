import "server-only";
import { z } from "zod";
import { throwEnvSchemaParsingError } from "./envHelpers";
import { PublicEnv, publicEnvSchema, rawPublicEnv } from "./publicEnv";

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnvSchema = z.object({
  // Provided by nais-*.yaml
  SYFO_OPPFOLGINGSPLAN_BACKEND_HOST: z.string(),
  SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID: z.string(),
  LUMI_API_HOST: z.string(),
  LUMI_API_CLIENT_ID: z.string(),
  // Provided by nais
  TOKEN_X_WELL_KNOWN_URL: z.string(),
  TOKEN_X_CLIENT_ID: z.string(),
  TOKEN_X_PRIVATE_JWK: z.string(),
  IDPORTEN_WELL_KNOWN_URL: z.string(),
  IDPORTEN_CLIENT_ID: z.string(),
  NAIS_CLUSTER_NAME: z.string(),
});

const rawServerEnv = {
  // Provided by nais-*.yml
  SYFO_OPPFOLGINGSPLAN_BACKEND_HOST:
    process.env.SYFO_OPPFOLGINGSPLAN_BACKEND_HOST,
  SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID:
    process.env.SYFO_OPPFOLGINGSPLAN_BACKEND_CLIENT_ID,
  LUMI_API_HOST: process.env.LUMI_API_HOST,
  LUMI_API_CLIENT_ID: process.env.LUMI_API_CLIENT_ID,

  // Provided by nais
  TOKEN_X_WELL_KNOWN_URL: process.env.TOKEN_X_WELL_KNOWN_URL,
  TOKEN_X_CLIENT_ID: process.env.TOKEN_X_CLIENT_ID,
  TOKEN_X_PRIVATE_JWK: process.env.TOKEN_X_PRIVATE_JWK,
  IDPORTEN_WELL_KNOWN_URL: process.env.IDPORTEN_WELL_KNOWN_URL,
  IDPORTEN_CLIENT_ID: process.env.IDPORTEN_CLIENT_ID,
  NAIS_CLUSTER_NAME: process.env.NAIS_CLUSTER_NAME,
} satisfies Record<keyof ServerEnv, string | undefined>;

let cachedServerEnv: Readonly<ServerEnv & PublicEnv> | undefined;

/**
 * Validates server and public environment variables against zod schemas that define the
 * expected variables, and returns an object containing all variables.
 * Caches the result after the first invocation.
 * Server environment variables don't need to be set in local or demo environment,
 * as long as we don't call this function if isLocalOrDemo is true.
 */
export function getServerEnv(): Readonly<ServerEnv & PublicEnv> {
  if (!cachedServerEnv) {
    try {
      cachedServerEnv = Object.freeze({
        ...serverEnvSchema.parse(rawServerEnv),
        ...publicEnvSchema.parse(rawPublicEnv),
      });
    } catch (e) {
      throwEnvSchemaParsingError(e);
    }
  }
  return cachedServerEnv;
}
