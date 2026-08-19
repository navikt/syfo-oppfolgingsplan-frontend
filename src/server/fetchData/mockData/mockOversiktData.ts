import type {
  OppfolgingsplanerOversiktForAG,
  OppfolgingsplanerOversiktForSM,
} from "@/schema/oversiktResponseSchemas";
import { mockCommonAGResponseFields } from "./mockEmployeeDetails";
import { mockAktivPlanData, mockTidligerePlanerData } from "./mockPlanerData";
import {
  eldreMockUnntaksvurdering,
  mockUnntaksvurdering,
} from "./mockUnntaksvurderingerData";

export const mockOversiktDataMedPlanerForAG: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: {
      sistLagretTidspunkt: "2025-10-28T10:17:31Z",
      utkastUtloperDato: "2026-02-28T10:17:31Z",
    },
    aktivPlan: mockAktivPlanData,
    tidligerePlaner: mockTidligerePlanerData,
    unntaksvurderinger: [],
    gjeldendeStatus: "AKTIV_PLAN",
  },
};

export const mockOversiktDataTom: OppfolgingsplanerOversiktForAG = {
  ...mockCommonAGResponseFields,
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
    unntaksvurderinger: [],
    gjeldendeStatus: "INGEN",
  },
};

export const mockOversiktDataMedPlanerForSM: OppfolgingsplanerOversiktForSM = {
  virksomheter: [
    {
      organization: mockAktivPlanData.organization,
      oppfolgingsplanhendelser: [
        tilPlanHendelse(mockAktivPlanData),
        ...mockTidligerePlanerData.map(tilPlanHendelse),
      ],
    },
  ],
};

export const mockOversiktDataTomForSM: OppfolgingsplanerOversiktForSM = {
  virksomheter: [],
};

const eldreMockUnntaksvurderingUtenOrganisasjonsnavn = {
  ...eldreMockUnntaksvurdering,
  organization: { orgNumber: "987654321", orgName: null },
};

export const mockOversiktDataMedUnntaksvurderingerForSM: OppfolgingsplanerOversiktForSM =
  {
    virksomheter: [
      {
        organization: mockUnntaksvurdering.organization,
        oppfolgingsplanhendelser: [
          tilPlanIkkeNodvendigHendelse(mockUnntaksvurdering),
        ],
      },
      {
        organization:
          eldreMockUnntaksvurderingUtenOrganisasjonsnavn.organization,
        oppfolgingsplanhendelser: [
          tilPlanIkkeNodvendigHendelse(
            eldreMockUnntaksvurderingUtenOrganisasjonsnavn,
          ),
        ],
      },
    ],
  };

export const mockOversiktDataOnlyActiveForSM: OppfolgingsplanerOversiktForSM = {
  virksomheter: [
    {
      organization: mockAktivPlanData.organization,
      oppfolgingsplanhendelser: [tilPlanHendelse(mockAktivPlanData)],
    },
  ],
};

function tilPlanHendelse(
  plan: typeof mockAktivPlanData,
): OppfolgingsplanerOversiktForSM["virksomheter"][number]["oppfolgingsplanhendelser"][number] {
  const { organization: _organization, ...planData } = plan;
  return { type: "FERDIGSTILT_PLAN", ...planData };
}

function tilPlanIkkeNodvendigHendelse(
  vurdering: typeof mockUnntaksvurdering,
): OppfolgingsplanerOversiktForSM["virksomheter"][number]["oppfolgingsplanhendelser"][number] {
  const { organization: _organization, ...vurderingData } = vurdering;
  return { type: "PLAN_IKKE_NODVENDIG", ...vurderingData };
}
