import { FerdigstiltPlanResponseForAG } from "@/schema/ferdigstiltPlanResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";

export const mockFerdigstiltPlanResponse: FerdigstiltPlanResponseForAG = {
  ...mockCommonAGResponseFields,
  oppfolgingsplan: {
    id: "223e4567-e89b-12d3-a456-426614174002",
    ferdigstiltTidspunkt: new Date("2025-10-28T10:17:31Z"),
    evalueringsDato: new Date("2025-12-31"),
    deltMedLegeTidspunkt: new Date("2025-10-28T10:19:16Z"),
    deltMedVeilederTidspunkt: new Date("2025-10-28T10:19:02Z"),
    content: {},
  },
};
