import type { ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
      variant === "primary" && "bg-ink text-white hover:bg-slate-800",
      variant === "secondary" && "bg-accent text-white hover:bg-amber-700",
      variant === "ghost" && "bg-white/80 text-ink hover:bg-white",
      className,
    )}
    {...props}
  />
);
