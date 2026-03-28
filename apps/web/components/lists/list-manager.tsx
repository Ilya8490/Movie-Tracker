"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "../../hooks/use-auth";
import { apiClient } from "../../lib/api-client";
import type { MovieList } from "../../lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const createListSchema = z.object({
  name: z.string().min(1),
  description: z.string().max(500).optional(),
});

export const ListManager = ({ tmdbId }: { tmdbId?: number }) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<z.infer<typeof createListSchema>>({
    resolver: zodResolver(createListSchema),
  });

  const listsQuery = useQuery({
    queryKey: ["lists"],
    queryFn: () => apiClient<MovieList[]>("/lists", { token }),
    enabled: Boolean(token),
  });

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof createListSchema>) =>
      apiClient<MovieList>("/lists", {
        method: "POST",
        body: values,
        token,
      }),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (listId: string) =>
      apiClient(`/lists/${listId}/items`, {
        method: "POST",
        body: { tmdbId },
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  return (
    <div className="space-y-6">
      <form
        className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card"
        onSubmit={handleSubmit((values) => createMutation.mutate(values))}
      >
        <h2 className="text-xl font-bold text-ink">Create custom list</h2>
        <div className="mt-4 space-y-3">
          <Input {...register("name")} placeholder="Favorites, Sunday Noir, 2026 discoveries..." />
          <Input {...register("description")} placeholder="Optional description" />
        </div>
        <Button type="submit" className="mt-4" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create list"}
        </Button>
      </form>

      <div className="space-y-4">
        {listsQuery.data?.map((list) => (
          <div key={list.id} className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-ink">{list.name}</h3>
                <p className="text-sm text-slate-500">{list.description || "No description"}</p>
              </div>
              {tmdbId ? (
                <Button
                  variant="secondary"
                  disabled={addMutation.isPending}
                  onClick={() => addMutation.mutate(list.id)}
                >
                  Add movie
                </Button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {list.items.map((item) => (
                <span key={item.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {item.movie.title}
                </span>
              ))}
              {list.items.length === 0 ? (
                <p className="text-sm text-slate-500">No movies in this list yet.</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
