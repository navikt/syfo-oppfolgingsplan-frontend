import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { render } from "@/test/test-utils";
import OversiktSideInformasjon, {
  TiltaksgruppeInformasjon,
} from "../OversiktSideInformasjon";
import OversiktSideIntroduksjon from "../OversiktSideIntroduksjon";

describe("OversiktSideInformasjon", () => {
  afterEach(() => {
    cleanup();
  });

  test("viser Figma-teksten for tiltaksgruppen", () => {
    render(
      <>
        <OversiktSideIntroduksjon erITiltaksgruppe={true} />
        <TiltaksgruppeInformasjon />
      </>,
    );

    expect(
      screen.getByText(
        "En god oppfølgingsplan gir dere felles retning og gjør det lettere å finne tilpasninger som fungerer.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Samarbeid med den ansatte" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Det beste er at du og den ansatte lager en oppfølgingsplan sammen. Du har ansvaret samtidig som den ansatte også har et eget ansvar til å bidra.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Bli enige om hvordan dere skal ha kontakt underveis",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Dere trenger ikke finne den perfekte løsningen med en gang. Ha dialog om hva som fungerer. Jevn kontakt har vist seg å bidra til at det blir lettere å komme tilbake i jobb.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Del planen med fastlegen og Nav" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Del planen med fastlegen innen 4 uker. Du kan sende den til Nav når som helst i forløpet. Hensikten er å gi et bilde av arbeidssituasjonen til den som er sykmeldt.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Oppdater planen underveis" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Situasjonen til den som er sykmeldt kan endre seg og det kan planen også. Husk å oppdatere planen når det skjer endringer i sykefraværet.",
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
      screen.getByText(
        /Du kan når som helst dele en oppfølgingsplan med medarbeiderens fastlege og Nav/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Samarbeid med den ansatte" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Ha dialog om hva som fungerer/i),
    ).not.toBeInTheDocument();
  });
});
