import { FerdigstiltPlanMetadata } from "@/schema/ferdigstiltPlanMetadataSchema";
import { OrganizationDetails } from "@/schema/organizationDetailsSchema";
import { mockOrganization } from "./mockEmployeeDetails";

/**
 * Mock-data for planer som brukes i oversikt-responsene.
 * Inkluderer organization per plan (OppfolgingsplanMetadata fra backend).
 */
type OppfolgingsplanMetadata = FerdigstiltPlanMetadata & {
  id: string;
  organization: OrganizationDetails;
};

export const mockAktivPlanData: OppfolgingsplanMetadata = {
  id: "223e4567-e89b-12d3-a456-426614174002",
  ferdigstiltTidspunkt: "2025-10-25T08:32:00Z",
  evalueringsDato: "2025-12-14",
  deltMedLegeTidspunkt: null,
  // deltMedLegeTidspunkt: getDayjsDateFromIsoString("2025-10-25T09:03:00Z"),
  // deltMedVeilederTidspunkt: null,
  deltMedVeilederTidspunkt: "2025-10-25T09:27:00Z",
  organization: mockOrganization,
};

export const mockTidligerePlanerData: OppfolgingsplanMetadata[] = [
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    ferdigstiltTidspunkt: "2025-05-14T17:15:00Z",
    evalueringsDato: "2025-08-31",
    deltMedVeilederTidspunkt: null,
    deltMedLegeTidspunkt: "2025-05-20T14:30:00Z",
    organization: mockOrganization,
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174000",
    ferdigstiltTidspunkt: "2025-03-05T16:41:00Z",
    evalueringsDato: "2025-05-12",
    deltMedVeilederTidspunkt: "2025-01-15T10:28:00Z",
    deltMedLegeTidspunkt: "2025-01-20T11:52:00Z",
    organization: mockOrganization,
  },
];
