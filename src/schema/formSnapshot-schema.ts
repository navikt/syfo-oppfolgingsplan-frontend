import z from "zod";

export const formSnapshotSchema = z.object({
  foo: z.string(),
  bar: z.number(),
});

export const utkastResponseSchema = z.object({
  id: z.string(),
  formSnapshot: formSnapshotSchema,
});

export type UtkastResponse = z.infer<typeof utkastResponseSchema>;

export const mockUtkastResponse: UtkastResponse = {
  id: "utkast-123",
  formSnapshot: {
    foo: "example",
    bar: 42,
  },
};
