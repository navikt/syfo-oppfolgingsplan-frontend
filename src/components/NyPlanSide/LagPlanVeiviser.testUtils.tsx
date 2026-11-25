import { act, render } from "@testing-library/react";
import { vi } from "vitest";
import type { OppfolgingsplanFormUnderArbeid } from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import type { ConvertedLagretUtkastResponse } from "@/schema/utkastResponseSchema";
import NyPlanSkjema from "./NyPlanSkjema";

vi.mock("next/navigation", () => ({
  useParams: () => ({ narmesteLederId: "12345" }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/common/logTaxonomyEvent", () => ({
  logTaxonomyEvent: vi.fn(),
}));

vi.mock("@/utils/scrollToAppTop", () => ({
  scrollToAppTopForAG: vi.fn(),
  scrollToAppTopForSM: vi.fn(),
}));

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
  {
    isDialogmoteTiltakspakkeActive = false,
    hasNoPlansInVirksomhet = false,
  } = {},
) {
  const lagretUtkastPromise = Promise.resolve(mockData);
  const tiltakspakkePromise = Promise.resolve({
    isDialogmoteTiltakspakkeActive,
  });

  let renderResult: ReturnType<typeof render> | null = null;
  const skjema = await NyPlanSkjema({
    narmesteLederId: "12345",
    lagretUtkastPromise,
    tiltakspakkePromise,
    hasNoPlansInVirksomhetPromise: Promise.resolve(hasNoPlansInVirksomhet),
  });

  await act(async () => {
    renderResult = render(skjema);
  });

  if (!renderResult) {
    throw new Error(
      "renderLagPlanVeiviserComponent failed to render component",
    );
  }

  return renderResult;
}
