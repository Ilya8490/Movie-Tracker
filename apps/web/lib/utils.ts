import { clsx } from "clsx";

export const cn = (...inputs: Array<string | undefined | false | null>) => clsx(inputs);

export const formatDate = (value: string | null) => {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};
