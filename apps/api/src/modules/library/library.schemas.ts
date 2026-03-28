import { z } from "zod";

const statusEnum = z.enum(["plan_to_watch", "watching", "watched", "dropped"]);

export const createLibraryItemSchema = z.object({
  body: z.object({
    tmdbId: z.number().int().positive(),
    status: statusEnum.default("plan_to_watch"),
    rating: z.number().int().min(1).max(10).nullable().optional(),
    review: z.string().max(2000).nullable().optional(),
    watchedAt: z.string().datetime().nullable().optional(),
  }),
});

export const updateLibraryItemSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: statusEnum.optional(),
    rating: z.number().int().min(1).max(10).nullable().optional(),
    review: z.string().max(2000).nullable().optional(),
    watchedAt: z.string().datetime().nullable().optional(),
  }),
});

export type CreateLibraryItemInput = z.infer<typeof createLibraryItemSchema>["body"];
export type UpdateLibraryItemInput = z.infer<typeof updateLibraryItemSchema>["body"];
