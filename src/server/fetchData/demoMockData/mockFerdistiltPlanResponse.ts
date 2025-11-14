import { FerdigstiltPlanResponseForAG } from "@/schema/ferdigstiltPlanResponseSchema";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";

export const mockFerdigstiltPlanResponse: FerdigstiltPlanResponseForAG = {
  ...mockCommonAGResponseFields,
  content: {},
  evalueringsDato: "2025-12-31",
  deltMedLegeTidspunkt: "2025-10-28T10:19:16Z",
  deltMedVeilederTidspunkt: "2025-10-28T10:19:02Z",
  ferdistiltTidspunkt: "2025-10-28T10:17:31Z",
};
