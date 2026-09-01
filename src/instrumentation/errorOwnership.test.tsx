import { captureException } from "@nais/apm";
import { render } from "@testing-library/react";
import {
  Component,
  type ComponentType,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ArbeidsgiverErrorPage from "@/app/[narmesteLederId]/error";
import SykmeldtErrorPage from "@/app/sykmeldt/error";

vi.mock("@nais/apm", () => ({ captureException: vi.fn() }));
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

type BoundaryProps = {
  ErrorPage: ErrorPageComponent;
  children: ReactNode;
};

type BoundaryState = {
  error: (Error & { digest?: string }) | null;
};

class BrowserErrorOwnerBoundary extends Component<
  BoundaryProps,
  BoundaryState
> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    captureException(error);
  }

  render() {
    if (this.state.error) {
      const ErrorPage = this.props.ErrorPage;
      return <ErrorPage error={this.state.error} reset={vi.fn()} />;
    }

    return this.props.children;
  }
}

function ThrowError({ error }: { error: Error }): never {
  throw error;
}

describe("browser error ownership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(
    errorPages,
  )("%s-siden lar error boundary eie rapporteringen", (_, ErrorPage) => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const error = new Error("syntetisk renderfeil");

    render(
      <BrowserErrorOwnerBoundary ErrorPage={ErrorPage}>
        <ThrowError error={error} />
      </BrowserErrorOwnerBoundary>,
    );

    expect(captureException).toHaveBeenCalledOnce();
    expect(captureException).toHaveBeenCalledWith(error);
    expect(consoleError).toHaveBeenCalled();
  });
});
