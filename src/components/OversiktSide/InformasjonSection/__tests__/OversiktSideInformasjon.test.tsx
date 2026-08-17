import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { render } from "@/test/test-utils";
import OversiktSideInformasjon from "../OversiktSideInformasjon";
import OversiktSideIntroduksjon from "../OversiktSideIntroduksjon";

describe("OversiktSideInformasjon", () => {
  afterEach(() => {
    cleanup();
  });

  test("viser tydeligere forsideinnhold for tiltaksgruppen", () => {
    render(
      <>
        <OversiktSideIntroduksjon erITiltaksgruppe={true} />
        <OversiktSideInformasjon erITiltaksgruppe={true} />
      </>,
    );

    expect(
      screen.getByText(/En god oppfølgingsplan gir dere en felles retning/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Bli enige om hvordan dere skal ha kontakt underveis",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /fastlegen et bedre grunnlag for å vurdere riktig gradert sykmelding/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Hjelp til å lage og bruke oppfølgingsplaner"),
    ).not.toBeInTheDocument();
  });

  test("beholder dagens innhold utenfor tiltaksgruppen", () => {
    render(
      <>
        <OversiktSideIntroduksjon erITiltaksgruppe={false} />
        <OversiktSideInformasjon />
      </>,
    );

    expect(
      screen.getByText(
        /Oppfølgingsplanen er et verktøy som brukes i sykefraværsoppfølgingen/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hjelp til å lage og bruke oppfølgingsplaner"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Oppfølgingsplanen sendes til Altinn",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        /fastlegen et bedre grunnlag for å vurdere riktig gradert sykmelding/i,
      ),
    ).not.toBeInTheDocument();
  });
});
