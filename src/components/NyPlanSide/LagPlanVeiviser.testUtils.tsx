import { act, render } from "@testing-library/react";
import { vi } from "vitest";
import { OppfolgingsplanFormUnderArbeid } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import { ConvertedLagretUtkastResponse } from "@/schema/utkastResponseSchema";
import LagPlanVeiviser from "./LagPlanVeiviser";

// Mock setup functions
export function setupMocks() {
  vi.mock("next/navigation", () => ({
    useParams: () => ({ narmesteLederId: "12345" }),
    useRouter: () => ({
      push: vi.fn(),
    }),
  }));

  // Mock the analytics event logging
  vi.mock("@/common/logTaxonomyEvent", () => ({
    logTaxonomyEvent: vi.fn(),
  }));

  // Mock scrollToAppTop to avoid issues in test environment
  vi.mock("@/utils/scrollToAppTop", () => ({
    scrollToAppTopForAG: vi.fn(),
    scrollToAppTopForSM: vi.fn(),
  }));
}

export function createMockLagretUtkastResponse(
  alreadyLagretUtkast?: OppfolgingsplanFormUnderArbeid,
): ConvertedLagretUtkastResponse {
  const utkastAndSistLagretTidspunkt = alreadyLagretUtkast
    ? {
        content: alreadyLagretUtkast,
        sistLagretTidspunkt: "2026-01-14T12:00:00Z",
      }
    : null;

  return {
    userHasEditAccess: true,
    utkast: utkastAndSistLagretTidspunkt,
    organization: {
      orgNumber: "123456789",
      orgName: "Test Bedrift AS",
    },
    employee: {
      fnr: "12345678901",
      name: "Test Ansatt",
    },
  };
}

export async function renderLagPlanVeiviserComponent(
  mockData: ConvertedLagretUtkastResponse,
) {
  const lagretUtkastPromise = Promise.resolve(mockData);

  let renderResult: ReturnType<typeof render>;

  await act(async () => {
    renderResult = render(
      <LagPlanVeiviser lagretUtkastPromise={lagretUtkastPromise} />,
    );
  });

  return renderResult!;
}
