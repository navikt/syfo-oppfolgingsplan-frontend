import type { OppfolgingsplanerOversiktForAG } from "@/schema/oversiktResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";

/**
 * Test-specific variants of oversikt data for different scenarios
 */

// User without edit access (employee not currently sick-listed)
export const mockOversiktDataNoEditAccess: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  userHasEditAccess: false,
  oversikt: {
    utkast: null,
    aktivPlan: mockAktivPlanData,
    tidligerePlaner: mockTidligerePlanerData,
  },
};

// Only draft, no active or previous plans
export const mockOversiktDataOnlyDraft: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: {
      sistLagretTidspunkt: "2025-10-28T10:17:31Z",
    },
    aktivPlan: null,
    tidligerePlaner: [],
  },
};

// Only active plan, no draft or previous plans
export const mockOversiktDataOnlyActivePlan: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: null,
    aktivPlan: mockAktivPlanData,
    tidligerePlaner: [],
  },
};

// Only previous plans, no active or draft
export const mockOversiktDataOnlyPreviousPlans: OppfolgingsplanerOversiktForAG =
  {
    ...mockCommonAGResponseFields,
    oversikt: {
      utkast: null,
      aktivPlan: null,
      tidligerePlaner: mockTidligerePlanerData,
    },
  };

// Empty state with edit access (should show "Lag ny plan" button)
export const mockOversiktDataEmptyWithAccess: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  userHasEditAccess: true,
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
  },
};

// Empty state without edit access
export const mockOversiktDataEmptyNoAccess: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  userHasEditAccess: false,
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
  },
};
