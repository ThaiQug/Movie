"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { safeCallbackPath } from "@/lib/auth/callback-url";

interface SignInFormProps {
  callbackUrl?: string;
  registered?: boolean;
}

export function SignInForm({ callbackUrl, registered = false }: SignInFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const destination = safeCallbackPath(callbackUrl);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      redirectTo: destination,
    });

    if (result?.error) {
      setError("Email hoặc mật khẩu không đúng.");
      setIsPending(false);
      return;
    }

    router.push(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {registered ? (
        <p className="rounded-xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200" role="status">
          Tạo tài khoản thành công. Bạn có thể đăng nhập ngay.
        </p>
      ) : null}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-zinc-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white focus:border-red-400/60 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-zinc-200">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white focus:border-red-400/60 focus:outline-none"
        />
      </div>
      {error ? (
        <p className="rounded-xl bg-amber-400/10 px-4 py-3 text-sm text-amber-200" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="min-h-11 w-full rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

