import z from "zod";
import {
  EmployeeDetails,
  commonResponseFieldsForAGSchema,
} from "@/schema/commonResponseFieldsSchemas";

export const mockEmployeeDetails: EmployeeDetails = {
  fnr: "17097534212",
  name: "Kreativ Hatt",
};

export const mockCommonAGResponseFields: z.infer<
  typeof commonResponseFieldsForAGSchema
> = {
  userHasEditAccess: true,
  organization: {
    orgNumber: "123456789",
    orgName: "Arbeidssted AS",
  },
  employee: mockEmployeeDetails,
};
