import type { InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-ocean",
      className,
    )}
    {...props}
  />
);
