import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MovieSlider } from "@/components/movies/movie-slider";
import { SectionState } from "@/components/ui/section-state";
import { ClockIcon } from "@/components/ui/icons";
import {
  getMovieDetail,
  getMoviesByCategory,
  MovieNotFoundError,
  type MovieDetail,
  type PaginatedMovies,
} from "@/lib/ophim";
import { sanitizeMovieContent } from "@/lib/sanitize";

async function getMovie(slug: string): Promise<MovieDetail> {
  try {
    return await getMovieDetail(slug);
  } catch (error) {
    if (error instanceof MovieNotFoundError) notFound();
    throw error;
  }
}

async function getRelated(movie: MovieDetail): Promise<PaginatedMovies | null> {
  const category = movie.categories[0];
  if (!category) return null;

  try {
    const result = await getMoviesByCategory(category.slug, { limit: 12 });
    return {
      ...result,
      items: result.items.filter((item) => item.slug !== movie.slug).slice(0, 10),
    };
  } catch {
    return null;
  }
}

function TaxonomyLinks({
  label,
  items,
  basePath,
}: {
  label: string;
  items: MovieDetail["categories"];
  basePath: "/the-loai" | "/quoc-gia";
}) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3 text-sm">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="flex flex-wrap gap-x-2 gap-y-1 text-zinc-200">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className="hover:text-red-400"
          >
            {item.name}
          </Link>
        ))}
      </dd>
    </div>
  );
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = await getMovie(slug);
  const related = await getRelated(movie);
  const content = sanitizeMovieContent(movie.contentHtml);
  const episodes = movie.servers.flatMap((server) =>
    server.episodes.map((episode) => ({
      ...episode,
      serverName: server.name,
    })),
  );

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute -right-40 -top-72 -z-20 size-[48rem] rounded-full bg-red-500/10 blur-[140px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/[0.025] to-[#07080b]" />

        <div className="page-container grid gap-8 py-10 sm:py-16 md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr] lg:gap-12">
          <div className="mx-auto w-full max-w-64 md:max-w-none">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl shadow-black/50">
              <Image
                src={movie.thumbnailUrl}
                alt={`Poster ${movie.name}`}
                fill
                priority
                quality={85}
                sizes="(max-width: 768px) 256px, 288px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="self-end">
            <div className="flex flex-wrap gap-2">
              {movie.quality ? (
                <span className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold">
                  {movie.quality}
                </span>
              ) : null}
              {movie.language ? (
                <span className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold">
                  {movie.language}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {movie.name}
            </h1>
            {movie.originalName ? (
              <p className="mt-3 text-base text-zinc-400 sm:text-lg">
                {movie.originalName}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-300">
              {movie.year ? <span>{movie.year}</span> : null}
              {movie.duration ? (
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="size-4 text-zinc-500" />
                  {movie.duration}
                </span>
              ) : null}
              {movie.currentEpisode ? <span>{movie.currentEpisode}</span> : null}
            </div>

            <button
              type="button"
              disabled
              title="Trình phát sẽ được bổ sung ở Phase 4"
              className="mt-7 cursor-not-allowed rounded-full bg-zinc-700 px-6 py-3 text-sm font-bold text-zinc-300 opacity-75"
            >
              Xem phim · Sắp ra mắt
            </button>

            <dl className="mt-8 space-y-3 border-t border-white/10 pt-6">
              <TaxonomyLinks
                label="Thể loại"
                items={movie.categories}
                basePath="/the-loai"
              />
              <TaxonomyLinks
                label="Quốc gia"
                items={movie.countries}
                basePath="/quoc-gia"
              />
              {movie.directors.length > 0 ? (
                <div className="grid grid-cols-[5.5rem_1fr] gap-3 text-sm">
                  <dt className="text-zinc-500">Đạo diễn</dt>
                  <dd className="text-zinc-200">{movie.directors.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </section>

      <div className="page-container grid gap-12 pb-16 lg:grid-cols-[1fr_21rem]">
        <section>
          <h2 className="text-2xl font-bold">Nội dung phim</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-400 sm:text-base">
            {content || "Nội dung đang được cập nhật."}
          </p>
          {movie.actors.length > 0 ? (
            <p className="mt-5 text-sm leading-6 text-zinc-500">
              <span className="font-semibold text-zinc-300">Diễn viên: </span>
              {movie.actors.join(", ")}
            </p>
          ) : null}
        </section>

        <section>
          <h2 className="text-2xl font-bold">Danh sách tập</h2>
          {episodes.length > 0 ? (
            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {episodes.map((episode, index) => (
                <div
                  key={`${episode.serverName}-${episode.slug}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3"
                >
                  <span className="truncate text-sm font-medium">
                    {episode.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-zinc-600">
                    {episode.serverName}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              Danh sách tập đang được cập nhật.
            </p>
          )}
        </section>
      </div>

      <div className="pb-20">
        {related && related.items.length > 0 ? (
          <MovieSlider
            title="Có thể bạn sẽ thích"
            eyebrow="Cùng thể loại"
            href={`/the-loai/${movie.categories[0]?.slug ?? ""}`}
            movies={related.items}
          />
        ) : (
          <div className="section-shell">
            <SectionState
              title="Chưa có phim liên quan"
              description="Cinematic sẽ bổ sung thêm gợi ý phù hợp trong thời gian tới."
            />
          </div>
        )}
      </div>
    </>
  );
}
