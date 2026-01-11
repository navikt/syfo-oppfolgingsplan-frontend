import { DEMO_SIMULATED_BACKEND_DELAY_MS } from "@/common/app-config";

export async function simulateBackendDelay(ms?: number) {
  await new Promise((resolve) =>
    setTimeout(resolve, ms ?? DEMO_SIMULATED_BACKEND_DELAY_MS),
  );
}
