import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { render } from "@/test/test-utils";
import { ArbeidsgiverPageContainer } from "./ArbeidsgiverPageContainer";

describe("ArbeidsgiverPageContainer", () => {
  afterEach(() => {
    cleanup();
  });

  test("links Oppfolgingsplaner to the new app", () => {
    render(
      <ArbeidsgiverPageContainer
        narmesteLederId="test-leder-id"
        employeeFnr="12345678910"
        employeeName="Ola Nordmann"
      >
        <div>Innhold</div>
      </ArbeidsgiverPageContainer>,
    );

    const oppfolgingsplanLinks = screen.getAllByRole("button", {
      name: "Oppfølgingsplaner",
    });

    expect(oppfolgingsplanLinks).toHaveLength(2);
    for (const link of oppfolgingsplanLinks) {
      expect(link).toHaveAttribute("href", "/test-leder-id");
    }
  });
});
