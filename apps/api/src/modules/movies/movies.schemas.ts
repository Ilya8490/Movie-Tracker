import { z } from "zod";

export const searchMoviesSchema = z.object({
  query: z.object({
    q: z.string().min(1),
  }),
});

export const movieParamsSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
