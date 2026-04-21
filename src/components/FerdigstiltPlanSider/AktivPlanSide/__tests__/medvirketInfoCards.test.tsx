import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { render } from "@/test/test-utils";
import { IkkeMedvirketInfoCard } from "../IkkeMedvirketInfoCard";
import { MedvirketInfoCard } from "../MedvirketInfoCard";

afterEach(() => {
  cleanup();
});

describe("IkkeMedvirketInfoCard", () => {
  it("renders the correct heading", () => {
    render(<IkkeMedvirketInfoCard isDeltMedVeileder={false} />);

    expect(screen.getByText(/planen er laget uten deg/i)).toBeInTheDocument();
  });

  it("shows NAV-contact info when delt med veileder", () => {
    render(<IkkeMedvirketInfoCard isDeltMedVeileder={true} />);

    expect(
      screen.getByRole("link", { name: /kontakt med Nav/i }),
    ).toBeInTheDocument();
  });

  it("does not show NAV-contact info when not delt med veileder", () => {
    render(<IkkeMedvirketInfoCard isDeltMedVeileder={false} />);

    expect(
      screen.queryByRole("link", { name: /kontakt med Nav/i }),
    ).not.toBeInTheDocument();
  });
});

describe("MedvirketInfoCard", () => {
  it("renders the correct heading", () => {
    render(<MedvirketInfoCard isDeltMedVeileder={false} />);

    expect(
      screen.getByText(/lederen din har delt oppfølgingsplanen med deg/i),
    ).toBeInTheDocument();
  });

  it("shows NAV-contact info when delt med veileder", () => {
    render(<MedvirketInfoCard isDeltMedVeileder={true} />);

    expect(
      screen.getByRole("link", { name: /kontakt med Nav/i }),
    ).toBeInTheDocument();
  });

  it("does not show NAV-contact info when not delt med veileder", () => {
    render(<MedvirketInfoCard isDeltMedVeileder={false} />);

    expect(
      screen.queryByRole("link", { name: /kontakt med Nav/i }),
    ).not.toBeInTheDocument();
  });
});
