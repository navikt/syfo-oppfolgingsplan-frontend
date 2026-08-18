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

describe("OppfolgingsplanerOversiktResponseSchemaForSM – unntaksvurderinger", () => {
  test("parser unntaksvurderinger med gjeldende-flagg fra backend-kontrakten", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForSM.safeParse({
      aktiveOppfolgingsplaner: [],
      tidligerePlaner: [],
      unntaksvurderinger: [{ ...unntaksvurderingFraBackend, gjeldende: true }],
    });

    expect(result.success).toBe(true);
    expect(result.data?.unntaksvurderinger).toEqual([
      { ...unntaksvurderingFraBackend, gjeldende: true },
    ]);
  });

  test("avviser unntaksvurderinger uten gjeldende-flagg", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForSM.safeParse({
      aktiveOppfolgingsplaner: [],
      tidligerePlaner: [],
      unntaksvurderinger: [unntaksvurderingFraBackend],
    });

    expect(result.success).toBe(false);
  });

  test("bruker tom liste når gammel backend mangler unntaksfeltet", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForSM.safeParse({
      aktiveOppfolgingsplaner: [],
      tidligerePlaner: [],
    });

    expect(result.success).toBe(true);
    expect(result.data?.unntaksvurderinger).toEqual([]);
  });
});
