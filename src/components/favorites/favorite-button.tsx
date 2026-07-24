"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartIcon } from "@/components/ui/icons";

interface FavoriteButtonProps {
  movie: {
    movieSlug: string;
    movieName: string;
    moviePosterUrl: string | null;
  };
  isAuthenticated: boolean;
  initialFavorite: boolean;
}

export function FavoriteButton({
  movie,
  isAuthenticated,
  initialFavorite,
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleFavorite() {
    if (!isAuthenticated) {
      const callbackUrl = `/phim/${movie.movieSlug}`;
      router.push(`/dang-nhap?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    const previousValue = isFavorite;
    const nextValue = !previousValue;
    setIsFavorite(nextValue);
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch(
        previousValue
          ? `/api/favorites/${encodeURIComponent(movie.movieSlug)}`
          : "/api/favorites",
        previousValue
          ? { method: "DELETE" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(movie),
            },
      );

      if (response.status === 401) {
        setIsFavorite(previousValue);
        router.push(
          `/dang-nhap?callbackUrl=${encodeURIComponent(`/phim/${movie.movieSlug}`)}`,
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Không thể cập nhật danh sách yêu thích.");
      }

      router.refresh();
    } catch {
      setIsFavorite(previousValue);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mt-7">
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={isPending}
        aria-pressed={isFavorite}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition disabled:cursor-wait disabled:opacity-70 ${
          isFavorite
            ? "border-red-400/40 bg-red-500/15 text-red-200"
            : "border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10"
        }`}
      >
        <HeartIcon className="size-5" filled={isFavorite} />
        {isPending
          ? "Đang cập nhật..."
          : isFavorite
            ? "Đã yêu thích"
            : "Thêm yêu thích"}
      </button>
      {error ? (
        <p className="mt-2 text-sm text-amber-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

