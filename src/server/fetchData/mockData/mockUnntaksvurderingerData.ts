import type { UnntaksvurderingMetadata } from "@/schema/unntaksvurderingSchemas";
import { mockOrganization } from "./mockEmployeeDetails";

/**
 * Mock-data for meldte unntaksvurderinger («oppfølgingsplan er ikke aktuell
 * nå»). Nyeste først, slik backend sorterer.
 */
export const mockUnntaksvurderingerData: UnntaksvurderingMetadata[] = [
  {
    id: "323e4567-e89b-12d3-a456-426614174010",
    meldtTidspunkt: "2026-02-10T09:12:00Z",
    meldtAv: { navn: "Maren Hegna", rolle: "ARBEIDSGIVER" },
    organization: mockOrganization,
  },
  {
    // Navn kan mangle hvis PDL-oppslaget feilet i backend.
    id: "323e4567-e89b-12d3-a456-426614174011",
    meldtTidspunkt: "2025-09-02T12:00:00Z",
    meldtAv: { navn: null, rolle: "ARBEIDSGIVER" },
    organization: mockOrganization,
  },
];
