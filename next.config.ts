/** @type {import('next').NextConfig} */
import { isLocalOrDemo } from "@/constants/envs";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { buildCspHeader } = require("@navikt/nav-dekoratoren-moduler/ssr");

const appDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-eval'",
    "https://uxsignals-frontend.uxsignals.app.iterate.no",
  ],
  "script-src-elem": [
    "'self'",
    "https://uxsignals-frontend.uxsignals.app.iterate.no",
  ],
  "style-src": ["'self'"],
  "img-src": ["'self'", "data:"],
  "font-src": ["'self'", "https://cdn.nav.no"],
  "worker-src": ["'self'"],
  "connect-src": ["'self'", "https://*.nav.no", "https://*.uxsignals.com"],
};

const nextConfig = {
  async headers() {
    const environment =
      process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "prod" ? "prod" : "dev";
    const cspValue = await buildCspHeader(appDirectives, { env: environment });

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspValue,
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: isLocalOrDemo ? "" : process.env.NEXT_PUBLIC_ASSET_PREFIX,
  productionBrowserSourceMaps: true,
  serverExternalPackages: [
    "@navikt/next-logger",
    "next-logger",
    "pino",
    "pino-roll",
  ],
  experimental: {
    optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
  },
};

module.exports = nextConfig;
