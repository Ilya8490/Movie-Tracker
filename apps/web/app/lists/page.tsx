"use client";

import { useAuth } from "../../hooks/use-auth";
import { ListManager } from "../../components/lists/list-manager";

export default function ListsPage() {
  const { token, isReady } = useAuth();

  if (!token && isReady) {
    return <p className="text-sm text-slate-600">Login to manage custom lists.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">Lists</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">Curate your collections.</h1>
      </div>
      <ListManager />
    </div>
  );
}
