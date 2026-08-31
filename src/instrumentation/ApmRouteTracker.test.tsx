import { useApmRouteTracking } from "@nais/apm/react";
import { render } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApmRouteTracker } from "./ApmRouteTracker";

vi.mock("@nais/apm/react", () => ({ useApmRouteTracking: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

describe("ApmRouteTracker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rapporterer bare normalisert App Router-rute", () => {
    vi.mocked(usePathname).mockReturnValue(
      "/syk/oppfolgingsplan/11111111-1111-4111-8111-111111111111/tidligere-planer/22222222-2222-4222-8222-222222222222",
    );

    render(<ApmRouteTracker />);

    expect(useApmRouteTracking).toHaveBeenCalledWith(
      "/syk/oppfolgingsplan/{narmesteLederId}/tidligere-planer/{planId}",
    );
  });
});
