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

async function expandUnntaksvalget() {
  const user = userEvent.setup();
  // Tittelen på valget er synlig før ekspandering …
  expect(
    screen.getByText(/Oppfølgingsplan er ikke aktuell nå/i),
  ).toBeInTheDocument();
  // … og innholdet åpnes med ExpansionCard-toggleknappen.
  await user.click(screen.getByRole("button", { name: /vis mer/i }));
  return user;
}

describe("MeldUnntakSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("viser unntaksvalget med bekreftelses-checkbox og sendeknapp som aldri er disabled", async () => {
    render(<MeldUnntakSection />);

    await expandUnntaksvalget();

    expect(
      screen.getByRole("checkbox", { name: /bekrefter/i }),
    ).not.toBeChecked();

    const sendeknapp = screen.getByRole("button", { name: /Meld fra/i });
    expect(sendeknapp).toBeEnabled();
  });

  test("viser feilmelding med fokus og kaller ikke backend når bekreftelsen mangler", async () => {
    render(<MeldUnntakSection />);

    const user = await expandUnntaksvalget();
    await user.click(screen.getByRole("button", { name: /Meld fra/i }));

    expect(
      screen.getByText(/Du må rette dette før du kan melde fra/i),
    ).toBeInTheDocument();
    // Fokus flyttes til ErrorSummary (WCAG: feil annonseres for skjermleser).
    await waitFor(() =>
      expect(document.activeElement?.textContent).toMatch(
        /Du må rette dette før du kan melde fra/i,
      ),
    );
    expect(mockMeldUnntak).not.toHaveBeenCalled();
  });

  test("kaller server action og viser kvittering uten løfter om andre visninger ved suksess", async () => {
    mockMeldUnntak.mockResolvedValue({ error: null });
    render(<MeldUnntakSection />);

    const user = await expandUnntaksvalget();
    await user.click(screen.getByRole("checkbox", { name: /bekrefter/i }));
    await user.click(screen.getByRole("button", { name: /Meld fra/i }));

    expect(mockMeldUnntak).toHaveBeenCalledWith("test-leder-id");

    const kvittering = await screen.findByText(
      /Du har meldt at oppfølgingsplan ikke er aktuell nå/i,
    );
    expect(kvittering).toBeInTheDocument();
    // Kvitteringen skal ikke love visninger som ikke finnes ennå (#888/#399).
    expect(
      screen.queryByText(/sendt til den ansatte/i),
    ).not.toBeInTheDocument();
    // Skjemaet er erstattet av kvitteringen.
    expect(
      screen.queryByRole("button", { name: /Meld fra/i }),
    ).not.toBeInTheDocument();
  });

  test("viser feil fra backend og lar arbeidsgiver prøve på nytt", async () => {
    mockMeldUnntak.mockResolvedValue({
      error: { type: FrontendErrorType.FETCH_NETWORK_ERROR },
    });
    render(<MeldUnntakSection />);

    const user = await expandUnntaksvalget();
    await user.click(screen.getByRole("checkbox", { name: /bekrefter/i }));
    await user.click(screen.getByRole("button", { name: /Meld fra/i }));

    expect(
      await screen.findByText(/Vi fikk ikke kontakt med tjenesten/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Meld fra/i })).toBeEnabled();
  });

  test("fjerner valideringsfeilen når bekreftelsen hukes av", async () => {
    render(<MeldUnntakSection />);

    const user = await expandUnntaksvalget();
    await user.click(screen.getByRole("button", { name: /Meld fra/i }));
    await user.click(screen.getByRole("checkbox", { name: /bekrefter/i }));

    expect(
      screen.queryByText(/Du må rette dette før du kan melde fra/i),
    ).not.toBeInTheDocument();
  });
});
