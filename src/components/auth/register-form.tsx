"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FieldErrors = Partial<Record<"name" | "email" | "password", string[]>>;

export function RegisterForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const result = (await response.json()) as {
      error?: string;
      fieldErrors?: FieldErrors;
    };

    if (!response.ok) {
      setError(result.error ?? "Không thể tạo tài khoản.");
      setFieldErrors(result.fieldErrors ?? {});
      setIsPending(false);
      return;
    }

    router.push("/dang-nhap?registered=1");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthField
        id="name"
        name="name"
        label="Tên hiển thị"
        autoComplete="name"
        placeholder="Không bắt buộc"
        error={fieldErrors.name?.[0]}
      />
      <AuthField
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
        error={fieldErrors.email?.[0]}
      />
      <AuthField
        id="password"
        name="password"
        type="password"
        label="Mật khẩu"
        autoComplete="new-password"
        required
        hint="Tối thiểu 8 ký tự, gồm chữ và số."
        error={fieldErrors.password?.[0]}
      />
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
        {isPending ? "Đang tạo tài khoản..." : "Đăng ký"}
      </button>
    </form>
  );
}

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

function AuthField({ label, error, hint, id, ...props }: AuthFieldProps) {
  const descriptionId = `${id}-description`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-zinc-200">
        {label}
      </label>
      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        className="min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-red-400/60 focus:outline-none"
      />
      {error || hint ? (
        <p
          id={descriptionId}
          className={`mt-2 text-xs ${error ? "text-amber-300" : "text-zinc-500"}`}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}

