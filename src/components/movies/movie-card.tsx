import Image from "next/image";
import Link from "next/link";
import type { MovieSummary } from "@/lib/ophim";

interface MovieCardProps {
  movie: MovieSummary;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const metadata = [movie.year, movie.duration].filter(Boolean).join(" · ");

  return (
    <article className="group min-w-0">
      <Link href={`/phim/${movie.slug}`} className="block rounded-xl">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 shadow-lg shadow-black/20">
          <Image
            src={movie.thumbnailUrl}
            alt={`Poster ${movie.name}`}
            fill
            priority={priority}
            quality={85}
            sizes="(max-width: 480px) 44vw, (max-width: 768px) 29vw, (max-width: 1280px) 20vw, 220px"
            className="object-cover object-center transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80" />
          <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-2">
            {movie.currentEpisode ? (
              <span className="max-w-[70%] truncate rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                {movie.currentEpisode}
              </span>
            ) : (
              <span />
            )}
            {movie.quality ? (
              <span className="rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold text-zinc-100 backdrop-blur">
                {movie.quality}
              </span>
            ) : null}
          </div>
        </div>
        <h3 className="mt-3 truncate text-sm font-semibold text-zinc-100 transition group-hover:text-red-400 sm:text-[0.95rem]">
          {movie.name}
        </h3>
        <p className="mt-1 truncate text-xs text-zinc-500">
          {metadata || movie.originalName || "Đang cập nhật"}
        </p>
      </Link>
    </article>
  );
}
