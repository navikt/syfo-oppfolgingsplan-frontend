/**
 * Closed, code-owned catalog of low-cardinality runtime error outcomes.
 *
 * NAV domain terms are Norwegian. Technical outcome suffixes stay English so
 * the values remain easy to scan together with the shared log contract.
 */
export const RuntimeErrorEvent = {
  OPPFOLGINGSPLAN_ARBEIDSGIVER_AKTIV_PLAN_FETCH_FAILED:
    "oppfolgingsplan_arbeidsgiver_aktiv_plan_fetch_failed",
  OPPFOLGINGSPLAN_ARBEIDSGIVER_OVERSIKT_FETCH_FAILED:
    "oppfolgingsplan_arbeidsgiver_oversikt_fetch_failed",
  OPPFOLGINGSPLAN_ARBEIDSGIVER_TIDLIGERE_PLAN_FETCH_FAILED:
    "oppfolgingsplan_arbeidsgiver_tidligere_plan_fetch_failed",
  OPPFOLGINGSPLAN_ARBEIDSGIVER_UTKAST_FETCH_FAILED:
    "oppfolgingsplan_arbeidsgiver_utkast_fetch_failed",
  OPPFOLGINGSPLAN_SYKMELDT_FERDIGSTILT_PLAN_FETCH_FAILED:
    "oppfolgingsplan_sykmeldt_ferdigstilt_plan_fetch_failed",
  OPPFOLGINGSPLAN_SYKMELDT_OVERSIKT_FETCH_FAILED:
    "oppfolgingsplan_sykmeldt_oversikt_fetch_failed",
  OPPFOLGINGSPLAN_DEL_MED_LEGE_FAILED: "oppfolgingsplan_del_med_lege_failed",
  OPPFOLGINGSPLAN_DEL_MED_NAV_VEILEDER_FAILED:
    "oppfolgingsplan_del_med_nav_veileder_failed",
  OPPFOLGINGSPLAN_FERDIGSTILLING_FAILED:
    "oppfolgingsplan_ferdigstilling_failed",
  OPPFOLGINGSPLAN_UNNTAKSVURDERING_SUBMIT_FAILED:
    "oppfolgingsplan_unntaksvurdering_submit_failed",
  OPPFOLGINGSPLAN_UTKAST_SAVE_FAILED: "oppfolgingsplan_utkast_save_failed",
  OPPFOLGINGSPLAN_UTKAST_FRA_AKTIV_PLAN_FAILED:
    "oppfolgingsplan_utkast_fra_aktiv_plan_failed",
  OPPFOLGINGSPLAN_UTKAST_DELETE_FAILED: "oppfolgingsplan_utkast_delete_failed",
  TILTAKSPAKKEVURDERING_FETCH_FAILED: "tiltakspakkevurdering_fetch_failed",
} as const;

export type RuntimeErrorEvent =
  (typeof RuntimeErrorEvent)[keyof typeof RuntimeErrorEvent];

/** Stable operation names describe what was attempted, without the outcome. */
export const RuntimeErrorOperation = {
  OPPFOLGINGSPLAN_ARBEIDSGIVER_AKTIV_PLAN_FETCH:
    "oppfolgingsplan_arbeidsgiver_aktiv_plan_fetch",
  OPPFOLGINGSPLAN_ARBEIDSGIVER_OVERSIKT_FETCH:
    "oppfolgingsplan_arbeidsgiver_oversikt_fetch",
  OPPFOLGINGSPLAN_ARBEIDSGIVER_TIDLIGERE_PLAN_FETCH:
    "oppfolgingsplan_arbeidsgiver_tidligere_plan_fetch",
  OPPFOLGINGSPLAN_ARBEIDSGIVER_UTKAST_FETCH:
    "oppfolgingsplan_arbeidsgiver_utkast_fetch",
  OPPFOLGINGSPLAN_SYKMELDT_FERDIGSTILT_PLAN_FETCH:
    "oppfolgingsplan_sykmeldt_ferdigstilt_plan_fetch",
  OPPFOLGINGSPLAN_SYKMELDT_OVERSIKT_FETCH:
    "oppfolgingsplan_sykmeldt_oversikt_fetch",
  OPPFOLGINGSPLAN_DEL_MED_LEGE: "oppfolgingsplan_del_med_lege",
  OPPFOLGINGSPLAN_DEL_MED_NAV_VEILEDER: "oppfolgingsplan_del_med_nav_veileder",
  OPPFOLGINGSPLAN_FERDIGSTILLING: "oppfolgingsplan_ferdigstilling",
  OPPFOLGINGSPLAN_UNNTAKSVURDERING_SUBMIT:
    "oppfolgingsplan_unntaksvurdering_submit",
  OPPFOLGINGSPLAN_UTKAST_SAVE: "oppfolgingsplan_utkast_save",
  OPPFOLGINGSPLAN_UTKAST_FRA_AKTIV_PLAN:
    "oppfolgingsplan_utkast_fra_aktiv_plan",
  OPPFOLGINGSPLAN_UTKAST_DELETE: "oppfolgingsplan_utkast_delete",
  TILTAKSPAKKEVURDERING_FETCH: "tiltakspakkevurdering_fetch",
} as const;

export type RuntimeErrorOperation =
  (typeof RuntimeErrorOperation)[keyof typeof RuntimeErrorOperation];

/** HTTP method is diagnostic metadata and must remain a bounded value. */
export type RuntimeErrorHttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export const runtimeErrorOperationByEvent = {
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_AKTIV_PLAN_FETCH_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_ARBEIDSGIVER_AKTIV_PLAN_FETCH,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_OVERSIKT_FETCH_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_ARBEIDSGIVER_OVERSIKT_FETCH,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_TIDLIGERE_PLAN_FETCH_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_ARBEIDSGIVER_TIDLIGERE_PLAN_FETCH,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_ARBEIDSGIVER_UTKAST_FETCH_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_ARBEIDSGIVER_UTKAST_FETCH,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_SYKMELDT_FERDIGSTILT_PLAN_FETCH_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_SYKMELDT_FERDIGSTILT_PLAN_FETCH,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_SYKMELDT_OVERSIKT_FETCH_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_SYKMELDT_OVERSIKT_FETCH,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_DEL_MED_LEGE_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_DEL_MED_LEGE,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_DEL_MED_NAV_VEILEDER_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_DEL_MED_NAV_VEILEDER,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_FERDIGSTILLING_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_FERDIGSTILLING,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_UNNTAKSVURDERING_SUBMIT_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_UNNTAKSVURDERING_SUBMIT,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_UTKAST_SAVE_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_UTKAST_SAVE,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_UTKAST_FRA_AKTIV_PLAN_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_UTKAST_FRA_AKTIV_PLAN,
  [RuntimeErrorEvent.OPPFOLGINGSPLAN_UTKAST_DELETE_FAILED]:
    RuntimeErrorOperation.OPPFOLGINGSPLAN_UTKAST_DELETE,
  [RuntimeErrorEvent.TILTAKSPAKKEVURDERING_FETCH_FAILED]:
    RuntimeErrorOperation.TILTAKSPAKKEVURDERING_FETCH,
} satisfies Record<RuntimeErrorEvent, RuntimeErrorOperation>;

export function getRuntimeErrorOperation(
  eventType: RuntimeErrorEvent,
): RuntimeErrorOperation {
  return runtimeErrorOperationByEvent[eventType];
}
