"use client";

import { useQuery } from "@tanstack/react-query";

import { SummaryCard } from "../../components/analytics/summary-card";
import { LibraryEditor } from "../../components/library/library-editor";
import { useAuth } from "../../hooks/use-auth";
import { apiClient } from "../../lib/api-client";
import type { AnalyticsSummaryResponse, LibraryItem } from "../../lib/types";
import { formatDate } from "../../lib/utils";

export default function LibraryPage() {
  const { token, isReady } = useAuth();

  const libraryQuery = useQuery({
    queryKey: ["library"],
    queryFn: () => apiClient<LibraryItem[]>("/library", { token }),
    enabled: isReady && Boolean(token),
  });

  const analyticsQuery = useQuery({
    queryKey: ["analytics"],
    queryFn: () => apiClient<AnalyticsSummaryResponse>("/analytics/summary", { token }),
    enabled: isReady && Boolean(token),
  });

  if (!token && isReady) {
    return <p className="text-sm text-slate-600">Login to view your library.</p>;
  }

  return (
    <div className="space-y-8">
      {analyticsQuery.data ? <SummaryCard summary={analyticsQuery.data} /> : null}

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {libraryQuery.data?.map((item) => (
            <article
              key={item.id}
              className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">{item.status}</p>
                  <h2 className="mt-2 text-2xl font-bold text-ink">{item.movie.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Added {formatDate(item.createdAt)} • Rating {item.rating ?? "-"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600">{item.review || "No review yet."}</p>

              <div className="mt-5">
                <LibraryEditor libraryItem={item} />
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-[28px] border border-dashed border-slate-300 bg-white/50 p-6">
          <h2 className="text-xl font-bold text-ink">Status breakdown</h2>
          {analyticsQuery.data ? (
            <div className="mt-4 space-y-3">
              {Object.entries(analyticsQuery.data.moviesPerStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm font-medium capitalize text-slate-600">{status.replaceAll("_", " ")}</span>
                  <span className="text-lg font-bold text-ink">{count}</span>
                </div>
              ))}
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
