import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  EpisodeSelector,
  PlayerSurface,
  ServerSelector,
} from "@/components/player";
import {
  getMovieDetail,
  MovieNotFoundError,
  type MovieDetail,
} from "@/lib/ophim";
import {
  buildPlayerHref,
  isCanonicalPlayerQuery,
  resolvePlayerSelection,
  type PlayerQuery,
} from "@/lib/player";

async function getMovie(slug: string): Promise<MovieDetail> {
  try {
    return await getMovieDetail(slug);
  } catch (error) {
    if (error instanceof MovieNotFoundError) notFound();
    throw error;
  }
}

export default async function WatchMoviePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<PlayerQuery>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const movie = await getMovie(slug);
  const selection = resolvePlayerSelection(movie.servers, query);

  if (selection && !isCanonicalPlayerQuery(query, selection)) {
    redirect(
      buildPlayerHref(slug, selection.server.index, selection.episode.slug),
    );
  }

  const playerTitle = selection
    ? `${movie.name} — ${selection.episode.name}`
    : movie.name;

  return (
    <main className="page-container py-8 sm:py-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={`/phim/${movie.slug}`}
            className="text-sm font-semibold text-zinc-500 transition hover:text-red-400"
          >
            ← Thông tin phim
          </Link>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
            {movie.name}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {selection
              ? `${selection.episode.name} · ${selection.server.name}`
              : "Chưa có nguồn phát an toàn"}
          </p>
        </div>
        {movie.quality || movie.language ? (
          <div className="flex gap-2">
            {movie.quality ? (
              <span className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                {movie.quality}
              </span>
            ) : null}
            {movie.language ? (
              <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                {movie.language}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
        <PlayerSurface
          key={
            selection
              ? `${selection.server.index}-${selection.episode.slug}`
              : "unavailable"
          }
          m3u8Url={selection?.episode.m3u8Url}
          embedUrl={selection?.episode.embedUrl}
          poster={movie.posterUrl}
          title={playerTitle}
        />
      </div>

      {selection ? (
        <div className="mt-8 space-y-8 rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-7">
          <ServerSelector
            movieSlug={movie.slug}
            servers={selection.servers}
            selectedServerIndex={selection.server.index}
          />
          <EpisodeSelector
            movieSlug={movie.slug}
            serverIndex={selection.server.index}
            episodes={selection.server.episodes}
            selectedEpisodeSlug={selection.episode.slug}
          />
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-3 text-sm leading-6 text-amber-200/70">
          Phim này chưa có nguồn HTTPS thuộc danh sách nhà cung cấp được phép.
          Vui lòng quay lại sau.
        </p>
      )}
    </main>
  );
}
