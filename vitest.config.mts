import nextEnv from "@next/env";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// NODE_ENV will be set to 'test' by Vitest automatically
// Configures Next-style env resolution, to load .env.test, .env.test.local, etc.
nextEnv.loadEnvConfig(process.cwd(), false);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/vitest-setup.ts",
  },
  resolve: {
    alias: {
      // server-only is automatically provided by Next.js, so we need to mock it in Vitest.
      // Could also install 'server-only' as dev dep, but this seems like good practice.
      "server-only": path.resolve(__dirname, "src/test/mocks/server-only.ts"),
    },
  },
});
