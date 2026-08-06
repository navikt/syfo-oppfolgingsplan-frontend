import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import PlanDelingStatusTags from "@/components/OversiktSide/PlanListe/PlanLinkCard/PlanLinkCardFooterTags";
import * as delPlanMedVeilederModule from "@/server/actions/delPlanMedVeileder";
import { render } from "@/test/test-utils";
import DelAktivPlanMedLegeEllerNav from "../../DelAktivPlan/DelAktivPlanMedLegeEllerNav";
import { PlanDelingProvider } from "../../PlanDelingContext";
import { AktivPlanTopTags } from "../AktivPlanTopTags";

const MOCK_PLAN_ID = "test-plan-123";
const MOCK_LEDER_ID = "test-leder-123";

// Datoformatet skjuler året når delingen skjedde inneværende år, derfor er
// årstallet valgfritt i regexene under.
const SENDT_TIL_FASTLEGE_MED_DATO = /^Sendt til fastlege 15\. januar( \d{4})?$/;
const SENDT_TIL_NAV_MED_DATO = /^Sendt til Nav 3\. februar( \d{4})?$/;

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return mockNextNavigation();
});

describe("AktivPlanTopTags", () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ narmesteLederId: MOCK_LEDER_ID });
  });

  afterEach(() => {
    cleanup();
  });

  function renderTopTags(
    initialDeltMedLegeTidspunkt: string | null = null,
    initialDeltMedVeilederTidspunkt: string | null = null,
  ) {
    return render(
      <PlanDelingProvider
        initialDeltMedLegeTidspunkt={initialDeltMedLegeTidspunkt}
        initialDeltMedVeilederTidspunkt={initialDeltMedVeilederTidspunkt}
      >
        <AktivPlanTopTags />
      </PlanDelingProvider>,
    );
  }

  test("viser dato for deling med både fastlege og Nav", () => {
    renderTopTags("2026-01-15T10:00:00Z", "2026-02-03T11:00:00Z");

    expect(screen.getByText(SENDT_TIL_FASTLEGE_MED_DATO)).toBeInTheDocument();
    expect(screen.getByText(SENDT_TIL_NAV_MED_DATO)).toBeInTheDocument();
  });

  test("viser dato kun for mottakeren som har fått planen", () => {
    renderTopTags("2026-01-15T10:00:00Z", null);

    expect(screen.getByText(SENDT_TIL_FASTLEGE_MED_DATO)).toBeInTheDocument();
    expect(screen.getByText("Ikke sendt til Nav")).toBeInTheDocument();
  });

  test("viser status uten dato når planen ikke er delt", () => {
    renderTopTags();

    expect(screen.getByText("Ikke sendt til fastlege")).toBeInTheDocument();
    expect(screen.getByText("Ikke sendt til Nav")).toBeInTheDocument();
  });

  test("oppdaterer taggen med dato etter vellykket deling, uten sideoppdatering", async () => {
    const user = userEvent.setup();
    const delMedVeilederSpy = vi
      .spyOn(delPlanMedVeilederModule, "delPlanMedVeilederServerAction")
      .mockResolvedValue({
        deltMedVeilederTidspunkt: "2026-02-03T11:00:00Z",
        errorDelMedVeileder: null,
      });

    render(
      <PlanDelingProvider
        initialDeltMedLegeTidspunkt="2026-01-15T10:00:00Z"
        initialDeltMedVeilederTidspunkt={null}
      >
        <AktivPlanTopTags />
        <DelAktivPlanMedLegeEllerNav planId={MOCK_PLAN_ID} />
      </PlanDelingProvider>,
    );

    expect(screen.getByText("Ikke sendt til Nav")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /nav-veileder/i }));
    await user.click(screen.getByRole("button", { name: /send planen/i }));

    await waitFor(() => {
      expect(screen.getByText(SENDT_TIL_NAV_MED_DATO)).toBeInTheDocument();
    });

    delMedVeilederSpy.mockRestore();
  });
});

describe("PlanDelingStatusTags uten delingstidspunkt", () => {
  afterEach(() => {
    cleanup();
  });

  test("viser ikke dato når tidspunkt ikke sendes inn, slik som i oversikten", () => {
    render(
      <PlanDelingStatusTags tagSize="small" isDeltMedLege isDeltMedVeileder />,
    );

    expect(screen.getByText("Sendt til fastlege")).toBeInTheDocument();
    expect(screen.getByText("Sendt til Nav")).toBeInTheDocument();
  });
});
