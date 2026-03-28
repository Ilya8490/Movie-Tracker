"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { MovieCard } from "../components/movies/movie-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { apiClient } from "../lib/api-client";
import type { MovieSearchResult } from "../lib/types";

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "inception";

  const resultsQuery = useQuery({
    queryKey: ["movies", query],
    queryFn: () => apiClient<MovieSearchResult[]>(`/movies/search?q=${encodeURIComponent(query)}`),
  });

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-card lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">Discover</p>
          <h1 className="mt-3 max-w-2xl text-5xl font-extrabold tracking-tight text-ink">
            Search TMDb and build a personal movie operating system.
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            Track what you plan to watch, what you finished, what you dropped, and what deserves a second look.
          </p>
        </div>

        <form action="/" className="rounded-[28px] bg-slate-50 p-5">
          <label className="mb-3 block text-sm font-medium text-slate-600">Search movies</label>
          <Input name="q" defaultValue={query} placeholder="Blade Runner 2049" />
          <Button type="submit" className="mt-4 w-full">
            Search
          </Button>
          <div className="mt-4 text-sm text-slate-500">
            New here? <Link href="/register" className="font-semibold text-ocean">Create an account</Link>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Results</p>
            <h2 className="text-2xl font-bold text-ink">Showing matches for "{query}"</h2>
          </div>
        </div>

        {resultsQuery.isLoading ? <p>Loading...</p> : null}
        {resultsQuery.error ? <p className="text-red-600">{resultsQuery.error.message}</p> : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {resultsQuery.data?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchPageContent />
    </Suspense>
  );
}
