"use client";

import { clientEnv } from "./env";

type HttpMethod = "GET" | "POST" | "PATCH";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
};

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const apiClient = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(response.status, data?.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
};
