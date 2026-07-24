import Link from "next/link";
import { buildPlayerHref, type PlayableEpisode } from "@/lib/player";

interface EpisodeSelectorProps {
  movieSlug: string;
  serverIndex: number;
  episodes: PlayableEpisode[];
  selectedEpisodeSlug: string;
}

export function EpisodeSelector({
  movieSlug,
  serverIndex,
  episodes,
  selectedEpisodeSlug,
}: EpisodeSelectorProps) {
  return (
    <section aria-labelledby="episode-selector-title">
      <h2
        id="episode-selector-title"
        className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-500"
      >
        Danh sách tập
      </h2>
      <div className="mt-3 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-5 lg:grid-cols-7">
        {episodes.map((episode, index) => {
          const active = episode.slug === selectedEpisodeSlug;

          return (
            <Link
              key={`${episode.slug}-${index}`}
              href={buildPlayerHref(movieSlug, serverIndex, episode.slug)}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={`truncate rounded-lg px-3 py-2.5 text-center text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
                active
                  ? "bg-red-500 text-white"
                  : "border border-white/8 bg-white/[0.035] text-zinc-300 hover:border-white/20 hover:bg-white/10"
              }`}
              title={episode.name}
            >
              {episode.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
