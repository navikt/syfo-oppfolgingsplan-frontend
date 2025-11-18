import { mockOpprettetPlanContent } from "@/server/fetchData/mockData/mockOpprettetPlanContent";
import FerdigstiltPlanSummary from "./FerdigstiltPlanSummary";

export function MockOpprettetPlanSummary() {
  return <FerdigstiltPlanSummary planContent={mockOpprettetPlanContent} />;
}
