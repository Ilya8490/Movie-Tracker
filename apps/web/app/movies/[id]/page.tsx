"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";

import { LibraryEditor } from "../../../components/library/library-editor";
import { ListManager } from "../../../components/lists/list-manager";
import { useAuth } from "../../../hooks/use-auth";
import { apiClient } from "../../../lib/api-client";
import type { LibraryItem, MovieDetails } from "../../../lib/types";
import { formatDate } from "../../../lib/utils";

export default function MovieDetailsPage() {
  const params = useParams<{ id: string }>();
  const { token } = useAuth();

  const movieQuery = useQuery({
    queryKey: ["movie", params.id],
    queryFn: () => apiClient<MovieDetails>(`/movies/${params.id}`),
  });

  const libraryQuery = useQuery({
    queryKey: ["library"],
    queryFn: () => apiClient<LibraryItem[]>("/library", { token }),
    enabled: Boolean(token),
  });

  const existingLibraryItem =
    libraryQuery.data?.find((item) => item.movie.tmdbId === Number(params.id)) ?? null;

  if (movieQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (movieQuery.error || !movieQuery.data) {
    return <p className="text-red-600">{movieQuery.error?.message ?? "Movie not found."}</p>;
  }

  const movie = movieQuery.data;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-card">
        <div className="relative aspect-[2/3] bg-slate-200">
          {movie.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No poster</div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">Movie details</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">{movie.title}</h1>
          <p className="mt-3 text-slate-500">
            Released {formatDate(movie.releaseDate)} • TMDb {movie.voteAverage ?? "-"}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span key={genre} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {genre}
              </span>
            ))}
          </div>
          <p className="mt-6 leading-7 text-slate-600">{movie.overview}</p>
        </div>

        {token ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <LibraryEditor tmdbId={movie.id} libraryItem={existingLibraryItem} />
            <ListManager tmdbId={movie.id} />
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-600">
            Login to add this movie to your library or lists.
          </div>
        )}
      </section>
    </div>
  );
}
