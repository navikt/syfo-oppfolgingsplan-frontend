import { FerdigstiltPlanResponseForAG } from "@/schema/ferdigstiltPlanResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
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
