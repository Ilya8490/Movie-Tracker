import type { TextareaHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none placeholder:text-slate-400 focus:border-ocean",
      className,
    )}
    {...props}
  />
);
