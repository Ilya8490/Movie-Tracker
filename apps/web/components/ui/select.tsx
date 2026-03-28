import type { SelectHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export const Select = ({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none focus:border-ocean",
      className,
    )}
    {...props}
  />
);
