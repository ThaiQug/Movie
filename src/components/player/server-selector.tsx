import Link from "next/link";
import { buildPlayerHref, type PlayableServer } from "@/lib/player";

interface ServerSelectorProps {
  movieSlug: string;
  servers: PlayableServer[];
  selectedServerIndex: number;
}

export function ServerSelector({
  movieSlug,
  servers,
  selectedServerIndex,
}: ServerSelectorProps) {
  return (
    <section aria-labelledby="server-selector-title">
      <h2
        id="server-selector-title"
        className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-500"
      >
        Server
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {servers.map((server) => {
          const active = server.index === selectedServerIndex;
          const firstEpisode = server.episodes[0];

          return (
            <Link
              key={server.index}
              href={buildPlayerHref(
                movieSlug,
                server.index,
                firstEpisode.slug,
              )}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
                active
                  ? "bg-red-500 text-white"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {server.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
