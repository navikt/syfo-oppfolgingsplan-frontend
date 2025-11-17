import z from "zod";

const organizationDetailsSchema = z.object({
  orgNumber: z.string(), // brukes ikke foreløpig
  orgName: z.string(),
});

export const employeeDetailsSchema = z.object({
  fnr: z.string(),
  name: z.string().nullable(), // kan det hende vi ikke får navn?
});

export type EmployeeDetails = z.infer<typeof employeeDetailsSchema>;

export const commonResponseFieldsForAGSchema = z.object({
  /**
   * Har AG-bruker tilgang til å ferdigstille planer, redigere utkast og
   * dele aktiv oppfølgingsplan med lege/Nav?
   * `false` hvis den ansatte ikke er eller nylig var sykmeldt.
   */
  userHasEditAccess: z.boolean(),
  organization: organizationDetailsSchema,
  employee: employeeDetailsSchema,
});

export const commonResponseFieldsForSMSchema = z.object({
  organization: organizationDetailsSchema,
  employee: employeeDetailsSchema,
});
