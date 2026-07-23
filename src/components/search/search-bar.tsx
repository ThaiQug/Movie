"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SearchIcon } from "@/components/ui/icons";

interface SearchBarProps {
  initialQuery: string;
}

export function SearchBar({ initialQuery }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeout = window.setTimeout(() => setQuery(initialQuery), 0);
    return () => window.clearTimeout(timeout);
  }, [initialQuery]);

  useEffect(() => {
    const normalized = query.trim().replace(/\s+/g, " ");
    if (normalized === initialQuery) return;

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (normalized) params.set("q", normalized);
      const search = params.toString();
      startTransition(() => {
        router.replace(search ? `${pathname}?${search}` : pathname, {
          scroll: false,
        });
      });
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [initialQuery, pathname, query, router]);

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-500" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Nhập tên phim bạn muốn tìm..."
        aria-label="Tên phim"
        className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-24 text-base text-white placeholder:text-zinc-600 focus:border-red-400/50 focus:bg-white/[0.07] focus:outline-none"
      />
      <span
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 transition ${
          isPending ? "opacity-100" : "opacity-0"
        }`}
        aria-live="polite"
      >
        Đang tìm…
      </span>
    </div>
  );
}
