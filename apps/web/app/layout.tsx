import type { Metadata } from "next";

import "../app/globals.css";
import { AppShell } from "../components/layout/app-shell";
import { AuthProvider } from "../providers/auth-provider";
import { QueryProvider } from "../providers/query-provider";

export const metadata: Metadata = {
  title: "Movie Tracker",
  description: "Search movies, build your library, create lists, and track analytics.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
