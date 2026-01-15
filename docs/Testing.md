## Why `@testing-library/jest-dom`?

Modified answer from Claude Sonnet:

`@testing-library/jest-dom` provides **custom matchers** that make assertions more readable and semantic. Without it, you'd have to write more verbose assertions.

It's a small dependency that makes your tests significantly more readable and maintainable. The matchers it provides (`.toBeInTheDocument()`, `.toHaveValue()`, `.toBeDisabled()`, etc.) clearly express intent and are the standard in the React testing community.

With `@testing-library/jest-dom`:

```typescript
expect(screen.getByText("Lagrer utkast...")).toBeInTheDocument();
expect(element).toHaveValue("some text");
expect(button).toBeDisabled();
```

Without it (using only Vitest):

```typescript
expect(screen.getByText("Lagrer utkast...")).toBeTruthy(); // less clear
expect(document.body.contains(element)).toBe(true); // verbose
expect(element.value).toBe("some text");
expect(button.disabled).toBe(true);
```

### Does Vitest have an alternative?

Yes! Vitest has its own package: `@vitest/browser` which includes DOM matchers. However, `@testing-library/jest-dom` is still the most popular choice because:

1. More mature - battle-tested with extensive community support
2. Framework agnostic - works with Jest, Vitest, and other test runners
3. Better documentation - more examples and resources available
4. Standard in the ecosystem - most React projects use it