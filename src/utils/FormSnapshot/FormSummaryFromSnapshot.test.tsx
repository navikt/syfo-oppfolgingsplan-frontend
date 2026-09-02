import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { formLabels } from "@/components/NyPlanSide/form-labels";
import { mockPlanFormSnapshot } from "@/server/fetchData/mockData/mockOPFormSnapshot";
import { FormSummaryFromSnapshot } from "./FormSummaryFromSnapshot";

describe("FormSummaryFromSnapshot", () => {
  test("viser oppdatert datotekst også for en eksisterende plan med gammel snapshot-tekst", () => {
    render(<FormSummaryFromSnapshot formSnapshot={mockPlanFormSnapshot} />);

    expect(screen.getByText(formLabels.evalueringsDato.label)).toBeVisible();
    expect(
      screen.queryByText(
        "Når skal dere evaluere planen og eventuelt justere den?",
      ),
    ).not.toBeInTheDocument();
  });
});
