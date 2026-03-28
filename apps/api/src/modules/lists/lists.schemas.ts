import { z } from "zod";

export const createListSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
  }),
});

export const addListItemSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    tmdbId: z.number().int().positive(),
  }),
});
