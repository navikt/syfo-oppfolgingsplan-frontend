import z from "zod";

const organizationDetailsSchema = z.object({
  orgNumber: z.string(), // brukes ikke foreløpig
  orgName: z.string().nullable(),
});

export const employeeDetailsSchema = z.object({
  fnr: z.string(),
  name: z.string(),
});

export type EmployeeDetails = z.infer<typeof employeeDetailsSchema>;

export const commonResponseFieldsSchema = z.object({
  /**
   * Har AG-bruker tilgang til å ferdigstille planer, redigere utkast og
   * dele aktiv oppfølgingsplan med lege/Nav?
   * `false` hvis den ansatte ikke er eller nylig var sykmeldt.
   */
  userHasEditAccess: z.boolean(),
  organization: organizationDetailsSchema,
  employee: employeeDetailsSchema,
});
