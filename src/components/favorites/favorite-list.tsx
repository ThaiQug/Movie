"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeartIcon } from "@/components/ui/icons";

export interface FavoriteListItem {
  id: string;
  movieSlug: string;
  movieName: string;
  moviePosterUrl: string | null;
  createdAt: string;
}

export function FavoriteList({
  initialFavorites,
}: {
  initialFavorites: FavoriteListItem[];
}) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function remove(movieSlug: string) {
    const previousFavorites = favorites;
    setFavorites((items) =>
      items.filter((item) => item.movieSlug !== movieSlug),
    );
    setPendingSlug(movieSlug);
    setError(null);

    try {
      const response = await fetch(
        `/api/favorites/${encodeURIComponent(movieSlug)}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Delete failed");
    } catch {
      setFavorites(previousFavorites);
      setError("Không thể xóa phim. Danh sách đã được khôi phục.");
    } finally {
      setPendingSlug(null);
    }
  }

  if (favorites.length === 0) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-8 text-center">
        <HeartIcon className="mx-auto size-9 text-zinc-600" />
        <h2 className="mt-4 font-semibold">Chưa có phim yêu thích</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Mở trang chi tiết phim và chọn “Thêm yêu thích”.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white"
        >
          Khám phá phim
        </Link>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <p className="mb-5 rounded-xl bg-amber-400/10 px-4 py-3 text-sm text-amber-200" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {favorites.map((favorite) => (
          <article key={favorite.id} className="min-w-0">
            <Link href={`/phim/${favorite.movieSlug}`} className="group block rounded-xl">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
                {favorite.moviePosterUrl ? (
                  <Image
                    src={favorite.moviePosterUrl}
                    alt={`Poster ${favorite.movieName}`}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 29vw, 220px"
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-zinc-700">
                    <HeartIcon className="size-10" />
                  </span>
                )}
              </div>
              <h2 className="mt-3 truncate text-sm font-semibold group-hover:text-red-300">
                {favorite.movieName}
              </h2>
            </Link>
            <button
              type="button"
              onClick={() => remove(favorite.movieSlug)}
              disabled={pendingSlug !== null}
              className="mt-2 min-h-10 text-xs font-semibold text-zinc-500 transition hover:text-red-300 disabled:cursor-wait"
            >
              {pendingSlug === favorite.movieSlug ? "Đang xóa..." : "Xóa khỏi yêu thích"}
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
