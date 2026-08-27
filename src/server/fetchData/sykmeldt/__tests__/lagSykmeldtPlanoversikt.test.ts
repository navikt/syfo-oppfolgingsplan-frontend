import { describe, expect, test } from "vitest";
import type { OppfolgingsplanerOversiktForSM } from "@/schema/oversiktResponseSchemas";
import { lagSykmeldtPlanoversikt } from "../lagSykmeldtPlanoversikt";

const organization = { orgNumber: "123456789", orgName: "Holmen skole" };
const plan = {
  type: "FERDIGSTILT_PLAN" as const,
  id: "223e4567-e89b-12d3-a456-426614174002",
  ferdigstiltTidspunkt: "2026-02-01T10:00:00Z",
  evalueringsDato: "2026-03-01",
  deltMedLegeTidspunkt: null,
  deltMedVeilederTidspunkt: null,
  stillingstittel: null,
  stillingsprosent: null,
};
const unntak = {
  type: "PLAN_IKKE_NODVENDIG" as const,
  id: "323e4567-e89b-12d3-a456-426614174010",
  meldtTidspunkt: "2026-01-01T10:00:00Z",
  meldtAv: { navn: "Maren Hegna", rolle: "ARBEIDSGIVER" as const },
};

function oversiktMed(
  ...oppfolgingsplanhendelser: OppfolgingsplanerOversiktForSM["virksomheter"][number]["oppfolgingsplanhendelser"]
): OppfolgingsplanerOversiktForSM {
  return {
    virksomheter: [{ virksomhet: organization, oppfolgingsplanhendelser }],
  };
}

describe("lagSykmeldtPlanoversikt", () => {
  test("velger tiltaksinnhold når minst én relevant virksomhet er i tiltaksgruppen", () => {
    const annenOrganization = {
      orgNumber: "987654321",
      orgName: "Bjørk skole",
    };
    const resultat = lagSykmeldtPlanoversikt(
      {
        virksomheter: [
          {
            virksomhet: organization,
            oppfolgingsplanhendelser: [plan],
          },
          {
            virksomhet: annenOrganization,
            oppfolgingsplanhendelser: [{ ...plan, id: "annen-plan" }],
          },
        ],
      },
      new Set([organization.orgNumber]),
    );

    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(true);
    expect(resultat.gjeldendeHendelser).toHaveLength(2);
  });

  test("ignorerer tiltaksgruppe-orgnumre som ikke finnes i oversikten", () => {
    const resultat = lagSykmeldtPlanoversikt(
      oversiktMed(plan),
      new Set(["987654321"]),
    );

    expect(resultat.harMinstEnVirksomhetITiltaksgruppe).toBe(false);
  });

  test("bruker første synlige hendelse som gjeldende uten egen statusutledning", () => {
    const resultat = lagSykmeldtPlanoversikt(
      oversiktMed(plan, unntak),
      new Set([organization.orgNumber]),
    );

    expect(
      resultat.gjeldendeHendelser.map(({ hendelse }) => hendelse.id),
    ).toEqual([plan.id]);
    expect(
      resultat.tidligereHendelser.map(({ hendelse }) => hendelse.id),
    ).toEqual([unntak.id]);
  });

  test("beholder gjeldende vurdering som registrert innslag", () => {
    const nyereUnntak = {
      ...unntak,
      meldtTidspunkt: "2026-03-01T10:00:00Z",
    };
    const resultat = lagSykmeldtPlanoversikt(
      oversiktMed(nyereUnntak, plan),
      new Set([organization.orgNumber]),
    );

    expect(resultat.gjeldendeHendelser[0]?.hendelse.id).toBe(nyereUnntak.id);
    expect(
      resultat.tidligereHendelser.map(({ hendelse }) => hendelse.id),
    ).toEqual([nyereUnntak.id, plan.id]);
  });

  test("lar første gjenværende hendelse bli gjeldende når et tiltak er skjult", () => {
    const resultat = lagSykmeldtPlanoversikt(
      oversiktMed({ ...unntak, meldtTidspunkt: "2026-03-01T10:00:00Z" }, plan),
      new Set(),
    );

    expect(resultat.gjeldendeHendelser[0]?.hendelse.id).toBe(plan.id);
    expect(resultat.tidligereHendelser).toEqual([]);
  });
});
