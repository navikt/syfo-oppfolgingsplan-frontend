import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SAVE_UTKAST_DEBOUNCE_DELAY } from "@/common/app-config";
import type {
  OppfolgingsplanFormUnderArbeid,
  OppfolgingsplanFormUtfyllt,
} from "@/schema/oppfolgingsplanForm/formValidationSchemas";
import * as lagreUtkastModule from "@/server/actions/lagreUtkast";
import { now } from "@/utils/dateAndTime/dateUtils";
import { formLabels } from "./form-labels";
import {
  createMockLagretUtkastResponse,
  renderLagPlanVeiviserComponent,
} from "./LagPlanVeiviser.testUtils";
import PlanFormSummary from "./OppsummeringSteg/PlanFormSummary";

const validFormContent: OppfolgingsplanFormUnderArbeid = {
  typiskArbeidshverdag: "Kontorarbeid med møter",
  arbeidsoppgaverSomKanUtfores: "Skrivearbeid og telefonmøter",
  arbeidsoppgaverSomIkkeKanUtfores: "Tunge løft",
  tidligereTilrettelegging: "Ergonomisk utstyr",
  tilretteleggingFremover: "Hjemmekontor to dager i uken",
  annenTilrettelegging: "Fleksibel arbeidstid",
  hvordanFolgeOpp: "Ukentlige oppfølgingsmøter",
  evalueringsDato: now().add(1, "month").format("YYYY-MM-DD"),
  harDenAnsatteMedvirket: "ja",
  denAnsatteHarIkkeMedvirketBegrunnelse: "",
};

describe("evalueringspåminnelse", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  test("vises bare for nærmeste ledere i tiltaksgruppen", async () => {
    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(),
      false,
    );

    expect(
      screen.queryByRole("radiogroup", {
        name: formLabels.evalueringPaaminnelse.label,
      }),
    ).not.toBeInTheDocument();

    cleanup();

    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(),
      true,
    );

    expect(
      screen.getByRole("radiogroup", {
        name: formLabels.evalueringPaaminnelse.label,
      }),
    ).toBeInTheDocument();
    const reminderGroup = screen.getByRole("radiogroup", {
      name: formLabels.evalueringPaaminnelse.label,
    });
    expect(
      within(reminderGroup).getByRole("radio", { name: "Ja" }),
    ).not.toBeChecked();
    expect(
      within(reminderGroup).getByRole("radio", { name: "Nei" }),
    ).not.toBeChecked();
  });

  test.each([
    ["true", "Ja"],
    ["false", "Nei"],
  ] as const)("bevarer lagret verdi %s når et utkast åpnes igjen", async (evalueringPaaminnelse, radioName) => {
    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse({
        ...validFormContent,
        evalueringPaaminnelse,
      }),
      true,
    );

    const reminderGroup = screen.getByRole("radiogroup", {
      name: formLabels.evalueringPaaminnelse.label,
    });
    expect(
      within(reminderGroup).getByRole("radio", { name: radioName }),
    ).toBeChecked();
  });

  test("krever et aktivt valg før brukeren kan gå til oppsummeringen", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(validFormContent),
      true,
    );

    await user.click(
      screen.getByRole("button", { name: /gå til oppsummering/i }),
    );

    expect(
      screen.getAllByText(
        /Du må svare ja eller nei på om du ønsker en påminnelse på e-post/,
      ),
    ).not.toHaveLength(0);
    expect(
      screen.queryByRole("heading", { name: "Oppsummering" }),
    ).not.toBeInTheDocument();
  });

  test.each([
    ["Ja", "true", "Ja"],
    ["Nei", "false", "Nei"],
  ] as const)("lagrer %s som %s i utkastet", async (_label, value, radioName) => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const lagreUtkastSpy = vi.spyOn(
      lagreUtkastModule,
      "lagreUtkastServerAction",
    );

    await renderLagPlanVeiviserComponent(
      createMockLagretUtkastResponse(),
      true,
    );

    const reminderGroup = screen.getByRole("radiogroup", {
      name: formLabels.evalueringPaaminnelse.label,
    });
    await user.click(
      within(reminderGroup).getByRole("radio", { name: radioName }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SAVE_UTKAST_DEBOUNCE_DELAY + 100);
    });

    expect(lagreUtkastSpy).toHaveBeenCalledWith(
      "12345",
      expect.objectContaining({ evalueringPaaminnelse: value }),
    );

    lagreUtkastSpy.mockRestore();
  });

  test.each([
    ["true", "Ja"],
    ["false", "Nei"],
  ] as const)("viser valgt svar %s som %s i oppsummeringen", (value, label) => {
    render(
      <PlanFormSummary
        formValues={
          {
            ...validFormContent,
            evalueringPaaminnelse: value,
            harDenAnsatteMedvirket: value === "true" ? "nei" : "ja",
          } as OppfolgingsplanFormUtfyllt & {
            evalueringPaaminnelse: typeof value;
          }
        }
        onEditPlan={vi.fn()}
        erITiltaksgruppe
      />,
    );
    expect(
      screen.getByText(formLabels.evalueringPaaminnelse.label),
    ).toBeVisible();
    expect(screen.getByText(label)).toBeVisible();
  });
});
