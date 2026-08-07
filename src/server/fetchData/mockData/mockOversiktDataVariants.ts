import type { OppfolgingsplanerOversiktForAG } from "@/schema/oversiktResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";
import { mockUnntaksvurderingerData } from "./mockUnntaksvurderingerData";

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
    unntaksvurderinger: [],
    gjeldendeStatus: "AKTIV_PLAN",
  },
};

// Only draft, no active or previous plans
export const mockOversiktDataOnlyDraft: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: {
      sistLagretTidspunkt: "2025-10-28T10:17:31Z",
      utkastUtloperDato: "2026-02-28T10:17:31Z",
    },
    aktivPlan: null,
    tidligerePlaner: [],
    unntaksvurderinger: [],
    gjeldendeStatus: "UTKAST",
  },
};

// Only active plan, no draft or previous plans
export const mockOversiktDataOnlyActivePlan: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: null,
    aktivPlan: mockAktivPlanData,
    tidligerePlaner: [],
    unntaksvurderinger: [],
    gjeldendeStatus: "AKTIV_PLAN",
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
      unntaksvurderinger: [],
      gjeldendeStatus: "INGEN",
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
    unntaksvurderinger: [],
    gjeldendeStatus: "INGEN",
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
    unntaksvurderinger: [],
    gjeldendeStatus: "INGEN",
  },
};

// Active plan + previous plans, no draft
export const mockOversiktDataAktivOgTidligere: OppfolgingsplanerOversiktForAG =
  {
    ...mockCommonAGResponseFields,
    oversikt: {
      utkast: null,
      aktivPlan: mockAktivPlanData,
      tidligerePlaner: mockTidligerePlanerData,
      unntaksvurderinger: [],
      gjeldendeStatus: "AKTIV_PLAN",
    },
  };

// Only draft without expiry date (utkastUtloperDato missing)
export const mockOversiktDataOnlyDraftWithoutExpiry: OppfolgingsplanerOversiktForAG =
  {
    ...mockCommonAGResponseFields,
    oversikt: {
      utkast: {
        sistLagretTidspunkt: "2025-10-28T10:17:31Z",
      },
      aktivPlan: null,
      tidligerePlaner: [],
      unntaksvurderinger: [],
      gjeldendeStatus: "UTKAST",
    },
  };

// Unntak meldt («plan ikke aktuell nå»), ingen planer eller utkast.
// Hovedvalget og unntaksvalget skal fortsatt vises i denne tilstanden.
export const mockOversiktDataMedUnntak: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
    unntaksvurderinger: mockUnntaksvurderingerData,
    gjeldendeStatus: "IKKE_AKTUELT",
  },
};

// Unntak + tidligere planer: historikken sidestiller begge kronologisk.
// (Kan ikke oppstå med dagens backend-partisjonering uten aktiv plan,
// men verner sorteringen den dagen partisjoneringen endrer seg.)
export const mockOversiktDataUnntakOgTidligerePlaner: OppfolgingsplanerOversiktForAG =
  {
    ...mockCommonAGResponseFields,
    oversikt: {
      utkast: null,
      aktivPlan: null,
      tidligerePlaner: mockTidligerePlanerData,
      unntaksvurderinger: mockUnntaksvurderingerData,
      gjeldendeStatus: "IKKE_AKTUELT",
    },
  };
