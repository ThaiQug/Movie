import Image from "next/image";
import Link from "next/link";
import type { MovieSummary } from "@/lib/ophim";

interface HeroBannerProps {
  movie: MovieSummary;
  backdropUrl?: string;
  description?: string;
}

export function HeroBanner({
  movie,
  backdropUrl,
  description,
}: HeroBannerProps) {
  const metadata = [
    movie.year,
    movie.quality,
    movie.language,
    movie.currentEpisode,
  ].filter(Boolean);

  return (
    <section className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-[#08090d] sm:min-h-[38rem] lg:min-h-[clamp(38rem,72vh,48rem)]">
      {backdropUrl ? (
        <Image
          src={backdropUrl}
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
      ) : null}

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#07080b] via-[#07080b]/70 to-transparent" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#07080b] via-transparent to-black/25" />
      <div className="absolute inset-y-0 left-0 -z-20 w-1/2 bg-[#07080b]/25" />

      <div className="page-container pb-16 pt-28 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-red-400">
            <span className="h-px w-8 bg-red-500" />
            Lựa chọn nổi bật
          </p>
          <h1 className="mt-5 text-4xl font-black leading-[1.04] tracking-[-0.04em] text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            {movie.name}
          </h1>
          {movie.originalName ? (
            <p className="mt-3 text-base text-zinc-200 drop-shadow sm:text-lg">
              {movie.originalName}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {metadata.map((item) => (
              <span
                key={String(item)}
                className="rounded-md border border-white/20 bg-black/35 px-2.5 py-1 text-xs font-semibold text-zinc-100 backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </div>

          {description ? (
            <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-zinc-200 drop-shadow-md sm:text-base">
              {description}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/phim/${movie.slug}`}
              className="rounded-md bg-white px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:bg-white/80"
            >
              Xem thông tin
            </Link>
            {movie.categories[0] ? (
              <Link
                href={`/the-loai/${movie.categories[0].slug}`}
                className="rounded-md bg-zinc-600/75 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-zinc-500/80"
              >
                {movie.categories[0].name}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
