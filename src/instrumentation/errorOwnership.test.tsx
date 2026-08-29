import { captureException } from "@nais/apm";
import { logger } from "@navikt/next-logger";
import { render } from "@testing-library/react";
import type { ComponentType, ImgHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ArbeidsgiverErrorPage from "@/app/[narmesteLederId]/error";
import SykmeldtErrorPage from "@/app/sykmeldt/error";

vi.mock("@nais/apm", () => ({ captureException: vi.fn() }));
vi.mock("@navikt/next-logger", () => ({
  logger: { error: vi.fn() },
}));
vi.mock("next/image", () => ({
  default: ({
    unoptimized: _,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & { unoptimized?: boolean }) => (
    // biome-ignore lint/performance/noImgElement: A plain image keeps this unit test independent of Next's image loader.
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

type ErrorPageComponent = ComponentType<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

const errorPages: Array<[string, ErrorPageComponent]> = [
  ["arbeidsgiver", ArbeidsgiverErrorPage],
  ["sykmeldt", SykmeldtErrorPage],
];

describe("browser error ownership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(
    errorPages,
  )("%s-siden sender én backendlogg uten en ekstra browser-capture", (_, ErrorPage) => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const error = new Error("syntetisk renderfeil");

    try {
      render(<ErrorPage error={error} reset={vi.fn()} />);

      expect(logger.error).toHaveBeenCalledOnce();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(captureException).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });
});
