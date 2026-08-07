import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { FrontendErrorType } from "@/server/actions/FrontendErrorTypeEnum";
import { meldUnntaksvurderingServerAction } from "@/server/actions/meldUnntaksvurdering";
import { render } from "@/test/test-utils";
import MeldUnntakSection from "../MeldUnntakSection";

vi.mock("next/navigation", async () => {
  const { mockNextNavigation } = await import(
    "@/test/mocks/nextNavigationMock"
  );

  return mockNextNavigation();
});

vi.mock("@/server/actions/meldUnntaksvurdering", () => ({
  meldUnntaksvurderingServerAction: vi.fn(),
}));

const mockMeldUnntak = vi.mocked(meldUnntaksvurderingServerAction);

function renderMeldUnntak() {
  return render(<MeldUnntakSection ansattNavn="Kreativ Hatt" />);
}

async function expandUnntaksvalget() {
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: /Det finnes noen unntak fra å lage oppfølgingsplan/i,
    }),
  );
  return user;
}

describe("MeldUnntakSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("viser eksempler på unntak, bekreftelse med den ansattes navn og lovhjemmel", async () => {
    renderMeldUnntak();

    await expandUnntaksvalget();

    expect(
      screen.getByText(/Den ansatte er for syk til å lage plan/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Det er ikke mulig å få kontakt med den ansatte/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", {
        name: /bekrefter at en oppfølgingsplan ikke er nødvendig for Kreativ Hatt/i,
      }),
    ).not.toBeChecked();
    expect(screen.getByText(/arbeidsmiljøloven § 4-6/i)).toBeInTheDocument();
  });

  test("sendeknappen er aldri disabled", async () => {
    renderMeldUnntak();

    await expandUnntaksvalget();

    expect(
      screen.getByRole("button", { name: /Send til Nav og den ansatte/i }),
    ).toBeEnabled();
  });

  test("viser feilmelding med fokus og kaller ikke backend når bekreftelsen mangler", async () => {
    renderMeldUnntak();

    const user = await expandUnntaksvalget();
    await user.click(
      screen.getByRole("button", { name: /Send til Nav og den ansatte/i }),
    );

    expect(
      screen.getByText(/Du må rette dette før du kan sende/i),
    ).toBeInTheDocument();
    // Fokus flyttes til ErrorSummary (WCAG: feil annonseres for skjermleser).
    await waitFor(() =>
      expect(document.activeElement?.textContent).toMatch(
        /Du må rette dette før du kan sende/i,
      ),
    );
    expect(mockMeldUnntak).not.toHaveBeenCalled();
  });

  test("kaller server action og viser kvittering med skissens tekst", async () => {
    mockMeldUnntak.mockResolvedValue({ error: null });
    renderMeldUnntak();

    const user = await expandUnntaksvalget();
    await user.click(screen.getByRole("checkbox", { name: /bekrefter/i }));
    await user.click(
      screen.getByRole("button", { name: /Send til Nav og den ansatte/i }),
    );

    expect(mockMeldUnntak).toHaveBeenCalledWith("test-leder-id");

    // Hele flaten er gated bak big bang-toggelen, så teksten kan love
    // sykmeldt-visningen (#888) — alt lanseres samlet.
    expect(
      await screen.findByText(/Meldingen er sendt til Nav og den ansatte/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Nav har registrert at det ikke er aktuelt med en oppfølgingsplan for Kreativ Hatt nå/i,
      ),
    ).toBeInTheDocument();
    // Skjemaet er erstattet av kvitteringen.
    expect(
      screen.queryByRole("button", { name: /Send til Nav og den ansatte/i }),
    ).not.toBeInTheDocument();
  });

  test("lukking av kvitteringen viser unntaksvalget igjen", async () => {
    mockMeldUnntak.mockResolvedValue({ error: null });
    renderMeldUnntak();

    const user = await expandUnntaksvalget();
    await user.click(screen.getByRole("checkbox", { name: /bekrefter/i }));
    await user.click(
      screen.getByRole("button", { name: /Send til Nav og den ansatte/i }),
    );
    await screen.findByText(/Meldingen er sendt til Nav og den ansatte/i);

    await user.click(screen.getByRole("button", { name: /lukk/i }));

    expect(
      screen.queryByText(/Meldingen er sendt til Nav og den ansatte/i),
    ).not.toBeInTheDocument();
    // Arbeidsgiver kan melde på nytt — valget består etter meldt unntak.
    expect(
      screen.getByRole("button", {
        name: /Det finnes noen unntak fra å lage oppfølgingsplan/i,
      }),
    ).toBeInTheDocument();
  });

  test("viser feil fra backend og lar arbeidsgiver prøve på nytt", async () => {
    mockMeldUnntak.mockResolvedValue({
      error: { type: FrontendErrorType.FETCH_NETWORK_ERROR },
    });
    renderMeldUnntak();

    const user = await expandUnntaksvalget();
    await user.click(screen.getByRole("checkbox", { name: /bekrefter/i }));
    await user.click(
      screen.getByRole("button", { name: /Send til Nav og den ansatte/i }),
    );

    expect(
      await screen.findByText(/Vi fikk ikke kontakt med tjenesten/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send til Nav og den ansatte/i }),
    ).toBeEnabled();
  });

  test("fjerner valideringsfeilen når bekreftelsen hukes av", async () => {
    renderMeldUnntak();

    const user = await expandUnntaksvalget();
    await user.click(
      screen.getByRole("button", { name: /Send til Nav og den ansatte/i }),
    );
    await user.click(screen.getByRole("checkbox", { name: /bekrefter/i }));

    expect(
      screen.queryByText(/Du må rette dette før du kan sende/i),
    ).not.toBeInTheDocument();
  });
});
