import { FerdigstiltPlanResponse } from "@/schema/ferdigstiltPlanResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
import { mockPlanFormSnapshot } from "./mockOPFormSnapshot";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";

export function getMockFerdigstiltPlanData(
  planId: string,
): FerdigstiltPlanResponse {
  // Sjekk om det er aktiv plan
  if (mockAktivPlanData.id === planId) {
    return {
      ...mockCommonAGResponseFields,
      oppfolgingsplan: {
        ...mockAktivPlanData,
        content: mockPlanFormSnapshot,
      },
    };
  }

  // Sjekk om det er en tidligere plan
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

  throw new Error(`Plan with id ${planId} not found in mock data`);
}
