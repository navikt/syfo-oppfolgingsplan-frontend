import { vi } from "vitest";

export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

const mockUseParams = vi.fn(() => ({ narmesteLederId: "test-leder-id" }));
const mockUseRouter = vi.fn(() => mockRouter);
const mockUsePathname = vi.fn(() => "/");
const mockRedirect = vi.fn();
const mockNotFound = vi.fn();

export function mockNextNavigation() {
  return {
    useParams: mockUseParams,
    useRouter: mockUseRouter,
    usePathname: mockUsePathname,
    redirect: mockRedirect,
    notFound: mockNotFound,
  };
}
