/**
 * Closed, code-owned catalog of low-cardinality runtime error types.
 *
 * Keep values semantic: one type should identify the user or domain operation
 * that failed. Transport details belong in error_code, status and method.
 */
export const RuntimeErrorEvent = {
  OPPFOLGINGSPLAN_EMPLOYER_ACTIVE_FETCH_FAILED:
    "oppfolgingsplan_employer_active_fetch_failed",
  OPPFOLGINGSPLAN_EMPLOYER_OVERVIEW_FETCH_FAILED:
    "oppfolgingsplan_employer_overview_fetch_failed",
  OPPFOLGINGSPLAN_EMPLOYER_PREVIOUS_FETCH_FAILED:
    "oppfolgingsplan_employer_previous_fetch_failed",
  OPPFOLGINGSPLAN_EMPLOYER_DRAFT_FETCH_FAILED:
    "oppfolgingsplan_employer_draft_fetch_failed",
  OPPFOLGINGSPLAN_EMPLOYEE_FINISHED_FETCH_FAILED:
    "oppfolgingsplan_employee_finished_fetch_failed",
  OPPFOLGINGSPLAN_EMPLOYEE_OVERVIEW_FETCH_FAILED:
    "oppfolgingsplan_employee_overview_fetch_failed",
  OPPFOLGINGSPLAN_SHARE_WITH_DOCTOR_FAILED:
    "oppfolgingsplan_share_with_doctor_failed",
  OPPFOLGINGSPLAN_SHARE_WITH_COUNSELLOR_FAILED:
    "oppfolgingsplan_share_with_counsellor_failed",
  OPPFOLGINGSPLAN_FINALIZE_FAILED: "oppfolgingsplan_finalize_failed",
  OPPFOLGINGSPLAN_EXCEPTION_ASSESSMENT_SUBMIT_FAILED:
    "oppfolgingsplan_exception_assessment_submit_failed",
  OPPFOLGINGSPLAN_DRAFT_SAVE_FAILED: "oppfolgingsplan_draft_save_failed",
  OPPFOLGINGSPLAN_DRAFT_DELETE_FAILED: "oppfolgingsplan_draft_delete_failed",
  LUMI_SURVEY_FEEDBACK_SUBMIT_FAILED: "lumi_survey_feedback_submit_failed",
  TILTAKSPAKKE_ASSESSMENT_FETCH_FAILED: "tiltakspakke_assessment_fetch_failed",
  OPPFOLGINGSPLAN_EMPLOYER_ERROR_BOUNDARY_RENDERED:
    "oppfolgingsplan_employer_error_boundary_rendered",
  OPPFOLGINGSPLAN_EMPLOYEE_ERROR_BOUNDARY_RENDERED:
    "oppfolgingsplan_employee_error_boundary_rendered",
} as const;

export type RuntimeErrorEvent =
  (typeof RuntimeErrorEvent)[keyof typeof RuntimeErrorEvent];
