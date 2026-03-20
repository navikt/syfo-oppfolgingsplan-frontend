import { vi } from "vitest";

export const mockLogAnalyticsEvent = vi.fn();

export function mockAnalytics() {
  return {
    logAnalyticsEvent: mockLogAnalyticsEvent,
  };
}
