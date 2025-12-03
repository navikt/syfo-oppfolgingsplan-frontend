import { FerdigstiltPlanResponseForAG } from "@/schema/ferdigstiltPlanResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
import { mockPlanFormSnapshot } from "./mockOPFormSnapshot";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";

export function getMockAktivPlanData(): FerdigstiltPlanResponseForAG {
  return {
    ...mockCommonAGResponseFields,
    oppfolgingsplan: {
      ...mockAktivPlanData,
      content: mockPlanFormSnapshot,
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
        content: mockPlanFormSnapshot,
      },
    };
  }

  throw new Error("Plan not found in mock data");
}
