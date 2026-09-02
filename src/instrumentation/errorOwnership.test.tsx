import { NaisConsoleInstrumentation } from "@nais/apm";
import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentType, ImgHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ArbeidsgiverErrorPage from "@/app/[narmesteLederId]/error";
import SykmeldtErrorPage from "@/app/sykmeldt/error";

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
  const nativeConsoleError = console.error;
  let instrumentation: NaisConsoleInstrumentation;
  let pushError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    console.error = vi.fn();
    pushError = vi.fn();
    instrumentation = new NaisConsoleInstrumentation();
    instrumentation.api = { pushError } as never;
    instrumentation.initialize();
  });

  afterEach(() => {
    cleanup();
    instrumentation.destroy();
    console.error = nativeConsoleError;
  });

  it.each(
    errorPages,
  )("%s-fallbacken lar browser-instrumenteringen eie rapporteringen", (_, ErrorPage) => {
    const error = new Error("syntetisk renderfeil");

    // React 19 reports a caught boundary error through console.error. This is
    // the production capture path installed by initNaisAPMClient.
    console.error(error);
    expect(pushError).toHaveBeenCalledOnce();
    expect(pushError).toHaveBeenCalledWith(error, undefined);

    render(<ErrorPage error={error} reset={vi.fn()} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(pushError).toHaveBeenCalledOnce();
  });
});
