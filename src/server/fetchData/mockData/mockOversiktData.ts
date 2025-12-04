import {
  OppfolgingsplanerOversiktForAG,
  OppfolgingsplanerOversiktForSM,
} from "@/schema/oversiktResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";

export const mockOversiktDataMedPlanerForAG: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: {
      sistLagretTidspunkt: new Date("2025-10-28T10:17:31Z"),
    },
    aktivPlan: mockAktivPlanData,
    tidligerePlaner: mockTidligerePlanerData,
  },
};

export const mockOversiktDataTom: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
  },
};

export const mockOversiktDataMedPlanerForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [mockAktivPlanData],
  tidligerePlaner: mockTidligerePlanerData,
};
