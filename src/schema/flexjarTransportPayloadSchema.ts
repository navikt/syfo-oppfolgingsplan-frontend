import { z } from "zod";

export const flexjarTransportSchema = z
  .object({
    feedbackId: z.string().min(1),

    svar: z.number(),
    question__svar: z.string(),

    feedback: z.string().optional(),
    question__feedback: z.string().optional(),
  })
  .extend({
    "hva-ville-du-endret": z.string().optional(),
    "question__hva-ville-du-endret": z.string().optional(),
  })
  .strict();
