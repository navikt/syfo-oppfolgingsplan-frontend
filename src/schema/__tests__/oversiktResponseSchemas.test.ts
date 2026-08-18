import { describe, expect, test } from "vitest";
import {
  OppfolgingsplanerOversiktResponseSchemaForAG,
  OppfolgingsplanerOversiktResponseSchemaForSM,
} from "../oversiktResponseSchemas";

const gyldigOversikt = {
  userHasEditAccess: true,
  organization: { orgNumber: "123456789", orgName: "Holmen skole" },
  employee: { fnr: "17097534212", name: "Kreativ Hatt" },
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
    unntaksvurderinger: [],
    gjeldendeStatus: "INGEN",
  },
};

const unntaksvurderingFraBackend = {
  id: "9f1c4567-e89b-12d3-a456-426614174999",
  meldtTidspunkt: "2026-03-14T09:12:00Z",
  meldtAv: { navn: "Maren Hegna", rolle: "ARBEIDSGIVER" },
  organization: { orgNumber: "123456789", orgName: "Holmen skole" },
};

describe("OppfolgingsplanerOversiktResponseSchemaForAG – unntaksvurderinger", () => {
  test("parser respons med unntaksvurderinger og gjeldendeStatus fra backend-kontrakten", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForAG.safeParse({
      ...gyldigOversikt,
      oversikt: {
        ...gyldigOversikt.oversikt,
        unntaksvurderinger: [unntaksvurderingFraBackend],
        gjeldendeStatus: "IKKE_AKTUELT",
      },
    });

    expect(result.success).toBe(true);
    expect(result.data?.oversikt.unntaksvurderinger).toEqual([
      unntaksvurderingFraBackend,
    ]);
    expect(result.data?.oversikt.gjeldendeStatus).toBe("IKKE_AKTUELT");
  });

  test("parser respons der meldtAv.navn er null (PDL-oppslag feilet i backend)", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForAG.safeParse({
      ...gyldigOversikt,
      oversikt: {
        ...gyldigOversikt.oversikt,
        unntaksvurderinger: [
          {
            ...unntaksvurderingFraBackend,
            meldtAv: { navn: null, rolle: "ARBEIDSGIVER" },
          },
        ],
        gjeldendeStatus: "IKKE_AKTUELT",
      },
    });

    expect(result.success).toBe(true);
    expect(
      result.data?.oversikt.unntaksvurderinger[0]?.meldtAv.navn,
    ).toBeNull();
  });

  test.each([
    "unntaksvurderinger",
    "gjeldendeStatus",
  ])("avviser respons uten påkrevd felt %s", (felt) => {
    const oversikt: Record<string, unknown> = {
      ...gyldigOversikt.oversikt,
    };
    delete oversikt[felt];

    const result = OppfolgingsplanerOversiktResponseSchemaForAG.safeParse({
      ...gyldigOversikt,
      oversikt,
    });

    expect(result.success).toBe(false);
  });

  test("avviser ukjent rolle", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForAG.safeParse({
      ...gyldigOversikt,
      oversikt: {
        ...gyldigOversikt.oversikt,
        unntaksvurderinger: [
          {
            ...unntaksvurderingFraBackend,
            meldtAv: { navn: "Maren Hegna", rolle: "NAV" },
          },
        ],
        gjeldendeStatus: "IKKE_AKTUELT",
      },
    });

    expect(result.success).toBe(false);
  });

  test("avviser unntaksvurdering uten meldtTidspunkt", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForAG.safeParse({
      ...gyldigOversikt,
      oversikt: {
        ...gyldigOversikt.oversikt,
        unntaksvurderinger: [
          { ...unntaksvurderingFraBackend, meldtTidspunkt: undefined },
        ],
        gjeldendeStatus: "IKKE_AKTUELT",
      },
    });

    expect(result.success).toBe(false);
  });
});

describe("OppfolgingsplanerOversiktResponseSchemaForSM – oppfolgingsplanhendelser", () => {
  test("parser en virksomhet med diskriminert hendelsesunion", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForSM.safeParse({
      virksomheter: [
        {
          organization: unntaksvurderingFraBackend.organization,
          oppfolgingsplanhendelser: [
            {
              type: "PLAN_IKKE_NODVENDIG",
              id: unntaksvurderingFraBackend.id,
              meldtTidspunkt: unntaksvurderingFraBackend.meldtTidspunkt,
              meldtAv: unntaksvurderingFraBackend.meldtAv,
            },
            {
              type: "FERDIGSTILT_PLAN",
              id: "223e4567-e89b-12d3-a456-426614174002",
              ferdigstiltTidspunkt: "2026-02-01T09:12:00Z",
              evalueringsDato: "2026-03-01",
              deltMedLegeTidspunkt: null,
              deltMedVeilederTidspunkt: null,
              stillingstittel: null,
              stillingsprosent: null,
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(
      result.data?.virksomheter[0]?.oppfolgingsplanhendelser.map(
        (hendelse) => hendelse.type,
      ),
    ).toEqual(["PLAN_IKKE_NODVENDIG", "FERDIGSTILT_PLAN"]);
  });

  test("avviser hendelse uten diskriminator", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForSM.safeParse({
      virksomheter: [
        {
          organization: unntaksvurderingFraBackend.organization,
          oppfolgingsplanhendelser: [
            {
              id: unntaksvurderingFraBackend.id,
              meldtTidspunkt: unntaksvurderingFraBackend.meldtTidspunkt,
              meldtAv: unntaksvurderingFraBackend.meldtAv,
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  test("avviser den gamle parallelle listekontrakten", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForSM.safeParse({
      aktiveOppfolgingsplaner: [],
      tidligerePlaner: [],
      unntaksvurderinger: [],
    });

    expect(result.success).toBe(false);
  });
});
