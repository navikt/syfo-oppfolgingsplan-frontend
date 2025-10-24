import { OppfolgingsplanerOversikt } from "@/schema/oppfolgingsplanerOversiktSchemas";

export const mockOversiktData: OppfolgingsplanerOversikt = {
  utkast: {
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    sykmeldtFnr: "01010112345",
    narmesteLederFnr: "01010154321",
    organisasjonsnummer: "987654321",
    evalueringsdato: null,
  },
  oppfolgingsplan: {
    uuid: "223e4567-e89b-12d3-a456-426614174000",
    sykmeldtFnr: "01010112345",
    narmesteLederFnr: "01010154321",
    organisasjonsnummer: "987654321",
    evalueringsdato: "2024-12-31",
    skalDelesMedVeileder: true,
    deltMedVeilederTidspunkt: "2024-01-15T10:00:00Z",
    skalDelesMedLege: false,
    deltMedLegeTidspunkt: "2024-01-20T14:30:00Z",
    createdAt: "2024-01-01T09:00:00Z",
  },
  previousOppfolgingsplaner: [],
};
