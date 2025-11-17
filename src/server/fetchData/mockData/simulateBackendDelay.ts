const DEFAULT_WAIT_TIME_MS = 300;

export async function simulateBackendDelay(ms?: number) {
  await new Promise((resolve) =>
    setTimeout(resolve, ms ?? DEFAULT_WAIT_TIME_MS),
  );
}
