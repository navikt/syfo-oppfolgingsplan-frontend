import { Theme } from "@navikt/ds-react";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

export function AllTheProviders({ children }: { children: ReactNode }) {
  return <Theme>{children}</Theme>;
}

export function customRender(ui: ReactElement) {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return <AllTheProviders>{children}</AllTheProviders>;
  };

  return render(ui, { wrapper: Wrapper });
}

/**
 * Render an async server component for testing.
 * Next.js server components return Promises, so we need to await them.
 * This helper handles the async rendering automatically.
 *
 * @param ui - A Promise that resolves to a React element (async server component)
 * @returns The render result from React Testing Library
 */
export async function renderAsync(ui: Promise<ReactElement | null | false>) {
  const component = await ui;
  if (!component) {
    // biome-ignore lint/complexity/noUselessFragments: parameter is required
    return customRender(<></>);
  }
  return customRender(component);
}

/**
 * Create mock PageProps for Next.js pages.
 * Returns an object with both params and searchParams as Promises,
 * matching Next.js 13+ PageProps structure.
 *
 * @param params - Route parameters object (e.g., { id: "123", slug: "test" })
 * @param searchParams - Optional query parameters object (defaults to empty)
 * @returns Object with params and searchParams as Promises
 */
export function createMockPageProps<T extends Record<string, string>>(
  params: T,
  searchParams: Record<string, string | string[] | undefined> = {},
): {
  params: Promise<T>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
} {
  return {
    params: Promise.resolve(params),
    searchParams: Promise.resolve(searchParams),
  };
}

// Override render with customRender as the default export
export { customRender as render };
