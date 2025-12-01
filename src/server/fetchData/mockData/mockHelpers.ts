import {
  FerdigstiltPlanResponseForAG,
  FerdigstiltPlanResponseForSM,
} from "@/schema/ferdigstiltPlanResponseSchemas";
import {
  mockCommonAGResponseFields,
  mockOrganization,
} from "./mockEmployeeDetails";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";

export function getMockAktivPlanData(): FerdigstiltPlanResponseForAG {
  return {
    ...mockCommonAGResponseFields,
    oppfolgingsplan: {
      ...mockAktivPlanData,
      content: {},
    },
  };
}

export function getMockAktivPlanDataForSM(): FerdigstiltPlanResponseForSM {
  return {
    organization: mockOrganization,
    oppfolgingsplan: {
      ...mockAktivPlanData,
      content: {},
    },
  };
}

export function getMockTidligerePlanData(
  planId: string,
): FerdigstiltPlanResponseForAG {
  const tidligerePlan = mockTidligerePlanerData.find((p) => p.id === planId);

  if (tidligerePlan) {
    return {
      ...mockCommonAGResponseFields,
      oppfolgingsplan: {
        ...tidligerePlan,
        content: {},
      },
    };
  }

  throw new Error("Plan not found in mock data");
}

export function getMockTidligerePlanDataForSM(
  planId: string,
): FerdigstiltPlanResponseForSM {
  const tidligerePlan = mockTidligerePlanerData.find((p) => p.id === planId);

  if (tidligerePlan) {
    return {
      organization: mockOrganization,
      oppfolgingsplan: {
        ...tidligerePlan,
        content: {},
      },
    };
  }

  throw new Error("Plan not found in mock data");
}
