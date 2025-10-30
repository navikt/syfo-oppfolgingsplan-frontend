import { OppfolgingsplanerOversikt } from "@/schema/oppfolgingsplanerOversiktSchemas";

export const mockOversiktData: OppfolgingsplanerOversikt = {
  utkast: {
    sykmeldtFnr: "01010112345",
    narmesteLederFnr: "01010154321",
    organisasjonsnummer: "987654321",
    updatedAt: "2025-10-28T10:17:31Z",
  },
  oppfolgingsplan: {
    uuid: "223e4567-e89b-12d3-a456-426614174000",
    sykmeldtFnr: "01010112345",
    narmesteLederFnr: "01010154321",
    organisasjonsnummer: "987654321",
    evalueringsdato: "2025-12-31",
    skalDelesMedVeileder: true,
    deltMedVeilederTidspunkt: "2025-10-25T10:00:00Z",
    skalDelesMedLege: false,
    deltMedLegeTidspunkt: "2025-10-25T14:30:00Z",
    createdAt: "2025-10-25T09:00:00Z",
  },
  previousOppfolgingsplaner: [],
};
