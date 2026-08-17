import type {
  OppfolgingsplanerOversiktForAG,
  OppfolgingsplanerOversiktForSM,
} from "@/schema/oversiktResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";
import { mockUnntaksvurderingerDataForSM } from "./mockUnntaksvurderingerData";

export const mockOversiktDataMedPlanerForAG: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: {
      sistLagretTidspunkt: "2025-10-28T10:17:31Z",
      utkastUtloperDato: "2026-02-28T10:17:31Z",
    },
    aktivPlan: mockAktivPlanData,
    tidligerePlaner: mockTidligerePlanerData,
    unntaksvurderinger: [],
    gjeldendeStatus: "AKTIV_PLAN",
  },
};

export const mockOversiktDataTom: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
    unntaksvurderinger: [],
    gjeldendeStatus: "INGEN",
  },
};

export const mockOversiktDataMedPlanerForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [mockAktivPlanData],
  tidligerePlaner: mockTidligerePlanerData,
  unntaksvurderinger: [],
  gjeldendeUnntaksvurderinger: [],
};

export const mockOversiktDataTomForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [],
  tidligerePlaner: [],
  unntaksvurderinger: [],
  gjeldendeUnntaksvurderinger: [],
};

export const mockOversiktDataMedUnntaksvurderingerForSM: OppfolgingsplanerOversiktForSM =
  {
    aktiveOppfolgingsplaner: [],
    tidligerePlaner: [],
    unntaksvurderinger: mockUnntaksvurderingerDataForSM,
    gjeldendeUnntaksvurderinger: mockUnntaksvurderingerDataForSM,
  };

export const mockOversiktDataOnlyActiveForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [mockAktivPlanData],
  tidligerePlaner: [],
  unntaksvurderinger: [],
  gjeldendeUnntaksvurderinger: [],
};
