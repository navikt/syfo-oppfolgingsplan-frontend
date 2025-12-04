import { z } from "zod";

export const organizationDetailsSchema = z.object({
  orgNumber: z.string(),
  orgName: z.string().nullable(),
});

export type OrganizationDetails = z.infer<typeof organizationDetailsSchema>;
