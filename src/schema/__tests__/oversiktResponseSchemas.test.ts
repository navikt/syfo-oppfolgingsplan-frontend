import { describe, expect, test } from "vitest";
import { OppfolgingsplanerOversiktResponseSchemaForAG } from "../oversiktResponseSchemas";

const gyldigOversiktUtenUnntak = {
  userHasEditAccess: true,
  organization: { orgNumber: "123456789", orgName: "Holmen skole" },
  employee: { fnr: "17097534212", name: "Kreativ Hatt" },
  oversikt: {
    utkast: null,
    aktivPlan: null,
    tidligerePlaner: [],
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
      ...gyldigOversiktUtenUnntak,
      oversikt: {
        ...gyldigOversiktUtenUnntak.oversikt,
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
      ...gyldigOversiktUtenUnntak,
      oversikt: {
        ...gyldigOversiktUtenUnntak.oversikt,
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

  test("defaulter til tom liste og udefinert status når backend ikke sender feltene ennå", () => {
    // Rollout-sikkerhet: frontend kan deployes før backend-PR #400.
    const result = OppfolgingsplanerOversiktResponseSchemaForAG.safeParse(
      gyldigOversiktUtenUnntak,
    );

    expect(result.success).toBe(true);
    expect(result.data?.oversikt.unntaksvurderinger).toEqual([]);
    expect(result.data?.oversikt.gjeldendeStatus).toBeUndefined();
  });

  test("avviser unntaksvurdering uten meldtTidspunkt", () => {
    const result = OppfolgingsplanerOversiktResponseSchemaForAG.safeParse({
      ...gyldigOversiktUtenUnntak,
      oversikt: {
        ...gyldigOversiktUtenUnntak.oversikt,
        unntaksvurderinger: [
          { ...unntaksvurderingFraBackend, meldtTidspunkt: undefined },
        ],
        gjeldendeStatus: "IKKE_AKTUELT",
      },
    });

    expect(result.success).toBe(false);
  });
});
