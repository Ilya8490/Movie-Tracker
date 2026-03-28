import type { AnalyticsSummaryResponse } from "../../lib/types";

export const SummaryCard = ({ summary }: { summary: AnalyticsSummaryResponse }) => (
  <section className="grid gap-4 md:grid-cols-3">
    <article className="rounded-[28px] bg-ink p-6 text-white shadow-card">
      <p className="text-sm uppercase tracking-[0.2em] text-white/70">Watched</p>
      <p className="mt-3 text-4xl font-extrabold">{summary.totalWatchedMovies}</p>
    </article>

    <article className="rounded-[28px] bg-ocean p-6 text-white shadow-card">
      <p className="text-sm uppercase tracking-[0.2em] text-white/70">Average Rating</p>
      <p className="mt-3 text-4xl font-extrabold">{summary.averageRating ?? "-"}</p>
    </article>

    <article className="rounded-[28px] bg-accent p-6 text-white shadow-card">
      <p className="text-sm uppercase tracking-[0.2em] text-white/70">In Progress</p>
      <p className="mt-3 text-4xl font-extrabold">{summary.moviesPerStatus.watching}</p>
    </article>
  </section>
);
