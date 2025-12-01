import {
  OppfolgingsplanerOversiktForAG,
  OppfolgingsplanerOversiktForSM,
} from "@/schema/oversiktResponseSchemas";
import {
  mockCommonAGResponseFields,
  mockOrganization,
} from "./mockEmployeeDetails";
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

const addOrganization = <T extends object>(plan: T) => ({
  ...plan,
  organization: mockOrganization,
});

export const mockOversiktDataMedPlanerForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [addOrganization(mockAktivPlanData)],
  tidligerePlaner: mockTidligerePlanerData.map(addOrganization),
};
