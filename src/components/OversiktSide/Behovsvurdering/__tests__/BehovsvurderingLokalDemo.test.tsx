import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test } from "vitest";
import { customRender } from "@/test/test-utils";
import { BehovsvurderingLokalDemo } from "../BehovsvurderingLokalDemo";

async function renderAndOpenCard() {
  const user = userEvent.setup();
  customRender(<BehovsvurderingLokalDemo />);

  const toggleButton = screen.getByRole("button", { expanded: false });
  await user.click(toggleButton);

  return { user };
}

describe("BehovsvurderingLokalDemo", () => {
  afterEach(() => {
    cleanup();
  });

  test("viser ExpansionCard med tittel 'Oppfølgingsplan er ikke aktuell nå'", () => {
    customRender(<BehovsvurderingLokalDemo />);

    expect(
      screen.getByText(/Oppfølgingsplan er ikke aktuell nå/i),
    ).toBeInTheDocument();
  });

  test("viser toggle-knapp med aria-expanded", () => {
    customRender(<BehovsvurderingLokalDemo />);

    expect(screen.getByRole("button", { expanded: false })).toBeInTheDocument();
  });

  test("bekreftelsesknappen er synlig etter at ekspandert kort åpnes", async () => {
    await renderAndOpenCard();

    expect(
      screen.getByRole("button", {
        name: /Bekreft at oppfølgingsplan ikke er aktuell nå/i,
      }),
    ).toBeInTheDocument();
  });

  test("viser kvittering etter bekreftelse", async () => {
    const { user } = await renderAndOpenCard();

    await user.click(
      screen.getByRole("button", {
        name: /Bekreft at oppfølgingsplan ikke er aktuell nå/i,
      }),
    );

    expect(
      screen.getByText(
        /Du har bekreftet at oppfølgingsplan ikke er aktuell nå/i,
      ),
    ).toBeInTheDocument();
  });

  test("viser Angre-knapp etter bekreftelse", async () => {
    const { user } = await renderAndOpenCard();

    await user.click(
      screen.getByRole("button", {
        name: /Bekreft at oppfølgingsplan ikke er aktuell nå/i,
      }),
    );

    expect(screen.getByRole("button", { name: /Angre/i })).toBeInTheDocument();
  });

  test("angre-knappen skjuler kvitteringen og viser bekreftelsesknappen igjen", async () => {
    const { user } = await renderAndOpenCard();

    await user.click(
      screen.getByRole("button", {
        name: /Bekreft at oppfølgingsplan ikke er aktuell nå/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: /Angre/i }));

    expect(screen.queryByText(/Du har bekreftet/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Bekreft at oppfølgingsplan ikke er aktuell nå/i,
      }),
    ).toBeInTheDocument();
  });

  test("viser logg-innslag etter bekreftelse", async () => {
    const { user } = await renderAndOpenCard();

    await user.click(
      screen.getByRole("button", {
        name: /Bekreft at oppfølgingsplan ikke er aktuell nå/i,
      }),
    );

    expect(
      screen.getAllByText(/Bekreftet at oppfølgingsplan ikke er aktuell nå/i)
        .length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Historikk \(demo\)/i)).toBeInTheDocument();
  });

  test("kvittering har role='status' for skjermleser", async () => {
    const { user } = await renderAndOpenCard();

    await user.click(
      screen.getByRole("button", {
        name: /Bekreft at oppfølgingsplan ikke er aktuell nå/i,
      }),
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
