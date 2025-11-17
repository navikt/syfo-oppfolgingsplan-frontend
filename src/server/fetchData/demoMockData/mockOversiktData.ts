import { OppfolgingsplanerOversiktForAG } from "@/schema/oversiktResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";

export const mockOversiktData: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: {
      sistLagretTidspunkt: new Date("2025-10-28T10:17:31Z"),
    },
    aktivPlan: {
      id: "223e4567-e89b-12d3-a456-426614174002",
      opprettetTidspunkt: new Date("2025-10-25T09:00:00Z"),
      evalueringsDato: new Date("2025-12-31"),
      deltMedVeilederTidspunkt: new Date("2025-10-25T10:00:00Z"),
      deltMedLegeTidspunkt: new Date("2025-10-25T14:30:00Z"),
    },
    tidligerePlaner: [
      {
        id: "223e4567-e89b-12d3-a456-426614174001",
        opprettetTidspunkt: new Date("2025-10-15T09:00:00Z"),
        evalueringsDato: new Date("2025-12-31"),
        deltMedVeilederTidspunkt: null,
        deltMedLegeTidspunkt: new Date("2024-01-20T14:30:00Z"),
      },
      {
        id: "223e4567-e89b-12d3-a456-426614174000",
        opprettetTidspunkt: new Date("2025-10-05T09:00:00Z"),
        evalueringsDato: new Date("2025-12-31"),
        deltMedVeilederTidspunkt: new Date("2024-01-15T10:00:00Z"),
        deltMedLegeTidspunkt: null,
      },
    ],
  },
};

export const mockOversiktDataTom: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
  },
};
