import { publicEnv } from "@/env-variables/publicEnv";

function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function joinUrl(prefix: string, path: string): string {
  const normalizedPath = ensureLeadingSlash(path);
  return `${prefix}${normalizedPath}`;
}

/**
 * URL for assets located in `public/`.
 */
export function publicAssetUrl(path: string): string {
  const cdnPrefix = publicEnv.NEXT_PUBLIC_ASSET_PREFIX;

  if (cdnPrefix) {
    return joinUrl(`${cdnPrefix}/public`, path);
  }

  return joinUrl(publicEnv.NEXT_PUBLIC_BASE_PATH, path);
}
