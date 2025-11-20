import { FerdigstiltPlanMetadata } from "@/schema/ferdigstiltPlanMetadataSchema";

export const mockAktivPlanData: FerdigstiltPlanMetadata & { id: string } = {
  id: "223e4567-e89b-12d3-a456-426614174002",
  ferdigstiltTidspunkt: new Date("2025-10-25T08:32:00Z"),
  evalueringsDato: new Date("2025-12-14"),
  deltMedLegeTidspunkt: null,
  // deltMedLegeTidspunkt: new Date("2025-10-25T09:03:00Z"),
  // deltMedVeilederTidspunkt: null,
  deltMedVeilederTidspunkt: new Date("2025-10-25T09:27:00Z"),
};

export const mockTidligerePlanerData: Array<
  FerdigstiltPlanMetadata & { id: string }
> = [
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    ferdigstiltTidspunkt: new Date("2025-05-14T17:15:00Z"),
    evalueringsDato: new Date("2025-08-31"),
    deltMedVeilederTidspunkt: null,
    deltMedLegeTidspunkt: new Date("2025-05-20T14:30:00Z"),
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174000",
    ferdigstiltTidspunkt: new Date("2025-03-05T16:41:00Z"),
    evalueringsDato: new Date("2025-05-12"),
    deltMedVeilederTidspunkt: new Date("2025-01-15T10:28:00Z"),
    deltMedLegeTidspunkt: new Date("2025-01-20T11:52:00Z"),
    // deltMedLegeTidspunkt: null,
  },
];
