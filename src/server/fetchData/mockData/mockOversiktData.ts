import type {
  OppfolgingsplanerOversiktForAG,
  OppfolgingsplanerOversiktForSM,
  SykmeldtArbeidsforhold,
} from "@/schema/oversiktResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";

const mockSykmeldtArbeidsforholdCanRequest: SykmeldtArbeidsforhold = {
  organisasjonsnummer: "123456789",
  organisasjonsnavn: "Bedrift AS",
  narmesteLederNavn: "Ola Nordmann",
  foresporselStatus: "CAN_REQUEST",
  foresporselTidspunkt: null,
};

const mockSykmeldtArbeidsforholdAlreadyRequested: SykmeldtArbeidsforhold = {
  organisasjonsnummer: "123456789",
  organisasjonsnavn: "Bedrift AS",
  narmesteLederNavn: "Ola Nordmann",
  foresporselStatus: "ALREADY_REQUESTED",
  foresporselTidspunkt: "2025-06-10T09:30:00Z",
};

const mockSykmeldtArbeidsforholdMissingNL: SykmeldtArbeidsforhold = {
  organisasjonsnummer: "123456789",
  organisasjonsnavn: "Bedrift AS",
  narmesteLederNavn: null,
  foresporselStatus: "MISSING_NARMESTELEDER",
  foresporselTidspunkt: null,
};

const mockSykmeldtArbeidsforholdHasActivePlan: SykmeldtArbeidsforhold = {
  organisasjonsnummer: "123456789",
  organisasjonsnavn: "Bedrift AS",
  narmesteLederNavn: "Ola Nordmann",
  foresporselStatus: "HAS_ACTIVE_PLAN",
  foresporselTidspunkt: null,
};

export const mockOversiktDataMedPlanerForAG: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: {
      sistLagretTidspunkt: "2025-10-28T10:17:31Z",
    },
    aktivPlan: mockAktivPlanData,
    tidligerePlaner: mockTidligerePlanerData,
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

export const mockOversiktDataMedPlanerForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [mockAktivPlanData],
  tidligerePlaner: mockTidligerePlanerData,
  sykmeldteArbeidsforhold: [mockSykmeldtArbeidsforholdHasActivePlan],
};

export const mockOversiktDataTomForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [],
  tidligerePlaner: [],
  sykmeldteArbeidsforhold: [mockSykmeldtArbeidsforholdCanRequest],
};

export const mockOversiktDataCanRequestForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [],
  tidligerePlaner: [],
  sykmeldteArbeidsforhold: [mockSykmeldtArbeidsforholdCanRequest],
};

export const mockOversiktDataAlreadyRequestedForSM: OppfolgingsplanerOversiktForSM =
  {
    aktiveOppfolgingsplaner: [],
    tidligerePlaner: [],
    sykmeldteArbeidsforhold: [mockSykmeldtArbeidsforholdAlreadyRequested],
  };

export const mockOversiktDataMissingNLForSM: OppfolgingsplanerOversiktForSM = {
  aktiveOppfolgingsplaner: [],
  tidligerePlaner: [],
  sykmeldteArbeidsforhold: [mockSykmeldtArbeidsforholdMissingNL],
};
