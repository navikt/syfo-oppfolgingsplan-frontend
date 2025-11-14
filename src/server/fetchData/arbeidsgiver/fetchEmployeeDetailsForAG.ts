import { getRedirectAfterLoginUrlForAG } from "@/auth/redirectToLogin";
import { isLocalOrDemo } from "@/env-variables/envHelpers";
import { getServerEnv } from "@/env-variables/serverEnv";
import {
  EmployeeDetails,
  employeeDetailsSchema,
} from "@/schema/commonResponseFieldsSchemas";
import { TokenXTargetApi } from "../../helpers";
import { tokenXFetchGet } from "../../tokenXFetch";
import { mockEmployeeDetails } from "../demoMockData/mockEmployeeDetails";

const getEndpointOrgAndEmployeeDetailsForAG = (narmesteLederId: string) =>
  `${getServerEnv().SYFO_OPPFOLGINGSPLAN_BACKEND_HOST}/api/v1/arbeidsgiver/${narmesteLederId}/TODO`;

export async function fetchEmployeeDetailsForAG(
  narmestelederid: string,
): Promise<EmployeeDetails> {
  if (isLocalOrDemo) {
    return mockEmployeeDetails;
  }

  return await tokenXFetchGet({
    targetApi: TokenXTargetApi.SYFO_OPPFOLGINGSPLAN_BACKEND,
    endpoint: getEndpointOrgAndEmployeeDetailsForAG(narmestelederid),
    responseDataSchema: employeeDetailsSchema,
    redirectAfterLoginUrl: getRedirectAfterLoginUrlForAG(narmestelederid),
  });
}
