"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { apiClient } from "../../lib/api-client";
import type { AuthResponse } from "../../lib/types";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = registerSchema.omit({ name: true });

type AuthFormProps = {
  mode: "login" | "register";
};

export const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const { login } = useAuth();
  const isRegisterMode = mode === "register";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(isRegisterMode ? registerSchema : loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof registerSchema>) =>
      apiClient<AuthResponse>(mode === "register" ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: isRegisterMode
          ? values
          : {
              email: values.email,
              password: values.password,
            },
      }),
    onSuccess: (data) => {
      login(data);
      router.push("/");
    },
  });

  return (
    <div className="mx-auto max-w-md rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-card backdrop-blur">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">
          {mode === "register" ? "Create account" : "Welcome back"}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
          {mode === "register" ? "Start tracking your movies." : "Sign in to your library."}
        </h1>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        {isRegisterMode ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Name</label>
            <Input {...register("name")} placeholder="Alex Johnson" />
            <p className="mt-1 text-sm text-red-600">{errors.name?.message}</p>
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
          <Input {...register("email")} type="email" placeholder="alex@example.com" />
          <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Password</label>
          <Input {...register("password")} type="password" placeholder="At least 8 characters" />
          <p className="mt-1 text-sm text-red-600">{errors.password?.message}</p>
        </div>

        {mutation.error ? <p className="text-sm text-red-600">{mutation.error.message}</p> : null}

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : mode === "register" ? "Create account" : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        {mode === "register" ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={mode === "register" ? "/login" : "/register"} className="font-semibold text-ocean">
          {mode === "register" ? "Login" : "Register"}
        </Link>
      </p>
    </div>
  );
};
