import z from "zod";
import {
  EmployeeDetails,
  commonResponseFieldsSchema,
} from "@/schema/commonResponseFieldsSchemas";
import { OrganizationDetails } from "@/schema/organizationDetailsSchema";

export const mockEmployeeDetails: EmployeeDetails = {
  fnr: "17097534212",
  name: "Kreativ Hatt",
};

export const mockOrganization: OrganizationDetails = {
  orgNumber: "123456789",
  orgName: "Holmen skole",
};

export const mockCommonAGResponseFields: z.infer<
  typeof commonResponseFieldsSchema
> = {
  userHasEditAccess: false,
  organization: mockOrganization,
  employee: mockEmployeeDetails,
};
