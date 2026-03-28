"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "../../hooks/use-auth";
import { apiClient } from "../../lib/api-client";
import type { LibraryItem } from "../../lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  status: z.enum(["plan_to_watch", "watching", "watched", "dropped"]),
  rating: z.string(),
  review: z.string().max(2000),
  watchedAt: z.string(),
});

type LibraryEditorProps = {
  tmdbId?: number;
  libraryItem?: LibraryItem | null;
};

export const LibraryEditor = ({ tmdbId, libraryItem }: LibraryEditorProps) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: libraryItem?.status ?? "plan_to_watch",
      rating: libraryItem?.rating ? String(libraryItem.rating) : "",
      review: libraryItem?.review ?? "",
      watchedAt: libraryItem?.watchedAt ? libraryItem.watchedAt.slice(0, 10) : "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const payload = {
        status: values.status,
        rating: values.rating ? Number(values.rating) : null,
        review: values.review || null,
        watchedAt: values.watchedAt ? new Date(values.watchedAt).toISOString() : null,
      };

      if (libraryItem) {
        return apiClient(`/library/${libraryItem.id}`, {
          method: "PATCH",
          body: payload,
          token,
        });
      }

      return apiClient("/library", {
        method: "POST",
        body: {
          tmdbId,
          ...payload,
        },
        token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
  });

  return (
    <form
      className="space-y-4 rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
        <Select {...register("status")}>
          <option value="plan_to_watch">Plan to watch</option>
          <option value="watching">Watching</option>
          <option value="watched">Watched</option>
          <option value="dropped">Dropped</option>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Rating</label>
        <Input {...register("rating")} type="number" min={1} max={10} placeholder="1 to 10" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Watched on</label>
        <Input {...register("watchedAt")} type="date" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Review</label>
        <Textarea {...register("review")} placeholder="What stood out to you?" />
        <p className="mt-1 text-sm text-red-600">{errors.review?.message}</p>
      </div>

      {mutation.error ? <p className="text-sm text-red-600">{mutation.error.message}</p> : null}

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : libraryItem ? "Update library entry" : "Add to library"}
      </Button>
    </form>
  );
};
