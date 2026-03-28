"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/button";

const navigation = [
  { href: "/", label: "Search" },
  { href: "/library", label: "Library" },
  { href: "/lists", label: "Lists" },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/50 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/" className="text-xl font-extrabold tracking-tight text-ink">
              Movie Tracker
            </Link>
            <p className="text-sm text-slate-500">Track what matters, not just what you watched.</p>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden gap-2 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    pathname === item.href ? "bg-ink text-white" : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-ink">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
};
