import { logger } from "@navikt/next-logger";
import { beforeEach, expect, test, vi } from "vitest";
import { recordAidPlanCreated } from "./recordAidPlanCreated";

const environment = vi.hoisted(() => ({ isLocalOrDemo: false }));
vi.mock("@/env-variables/envHelpers", () => environment);
vi.mock("@navikt/next-logger", () => ({ logger: { info: vi.fn() } }));

beforeEach(() => {
  vi.mocked(logger.info).mockReset();
  environment.isLocalOrDemo = false;
});

test.each([
  "tiltak",
  "kontroll",
  "utenfor_scope",
  "ukjent",
] as const)("keeps %s separate and projects only approved fields", (gruppe) => {
  const context = {
    gruppe,
    erITiltaksgruppe: false,
    orgnummer: "sensitive-canary",
  };
  recordAidPlanCreated(context, true);
  expect(logger.info).toHaveBeenCalledExactlyOnceWith(
    {
      event_type: "aid_plan_opprettet",
      schema_version: "1",
      tiltakspakke: "OPPFOLGINGSPLAN_TILTAKSPAKKE_1",
      gruppe,
      variant: "standard",
      evaluering_paaminnelse: "ja",
    },
    "Opprettelse av plan bekreftet av backend",
  );
});

test("does not turn logging failure into saving failure", () => {
  vi.mocked(logger.info).mockImplementation(() => {
    throw new Error("logger unavailable");
  });
  expect(() =>
    recordAidPlanCreated({ gruppe: "tiltak", erITiltaksgruppe: true }, false),
  ).not.toThrow();
});

test("does not publish local or demo data", () => {
  environment.isLocalOrDemo = true;
  recordAidPlanCreated({ gruppe: "tiltak", erITiltaksgruppe: true }, true);
  expect(logger.info).not.toHaveBeenCalled();
});
