import Image from "next/image";
import Link from "next/link";

import type { MovieSearchResult } from "../../lib/types";
import { formatDate } from "../../lib/utils";
import { Button } from "../ui/button";

export const MovieCard = ({ movie }: { movie: MovieSearchResult }) => (
  <article className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-card backdrop-blur">
    <div className="relative aspect-[2/3] bg-slate-200">
      {movie.posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">No poster</div>
      )}
    </div>

    <div className="space-y-3 p-5">
      <div>
        <h2 className="text-lg font-bold text-ink">{movie.title}</h2>
        <p className="text-sm text-slate-500">{formatDate(movie.releaseDate)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {movie.genres.slice(0, 3).map((genre) => (
          <span key={genre} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {genre}
          </span>
        ))}
      </div>

      <p className="line-clamp-3 text-sm text-slate-600">{movie.overview || "No overview available."}</p>

      <Link href={`/movies/${movie.id}`}>
        <Button variant="secondary" className="w-full">
          View details
        </Button>
      </Link>
    </div>
  </article>
);
