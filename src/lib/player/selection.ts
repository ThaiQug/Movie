import type { MovieServer } from "@/lib/ophim";
import {
  getPlayerHostAllowlists,
  sanitizePlaybackUrl,
  type PlayerHostAllowlists,
} from "./urls";
import type {
  PlayableEpisode,
  PlayableServer,
  PlayerQuery,
  PlayerSelection,
} from "./types";

function firstQueryValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parseServerIndex(value: string | string[] | undefined): number | null {
  const text = firstQueryValue(value);
  if (!/^(0|[1-9]\d*)$/.test(text)) return null;

  const index = Number(text);
  return Number.isSafeInteger(index) ? index : null;
}

function playableEpisode(
  episode: MovieServer["episodes"][number],
  allowlists: PlayerHostAllowlists,
): PlayableEpisode | null {
  const m3u8Url = sanitizePlaybackUrl(episode.m3u8Url, allowlists.video);
  const embedUrl = sanitizePlaybackUrl(episode.embedUrl, allowlists.embed);

  if (!m3u8Url && !embedUrl) return null;

  return {
    name: episode.name,
    slug: episode.slug,
    m3u8Url,
    embedUrl,
  };
}

function playableServers(
  servers: MovieServer[],
  allowlists: PlayerHostAllowlists,
): PlayableServer[] {
  return servers.flatMap((server, index) => {
    const episodes = server.episodes.flatMap((episode) => {
      const playable = playableEpisode(episode, allowlists);
      return playable ? [playable] : [];
    });

    return episodes.length > 0
      ? [{ index, name: server.name, episodes }]
      : [];
  });
}

export function resolvePlayerSelection(
  servers: MovieServer[],
  query: PlayerQuery,
  allowlists: PlayerHostAllowlists = getPlayerHostAllowlists(),
): PlayerSelection | null {
  const availableServers = playableServers(servers, allowlists);
  if (availableServers.length === 0) return null;

  const requestedServerIndex = parseServerIndex(query.server);
  const server =
    availableServers.find(({ index }) => index === requestedServerIndex) ??
    availableServers[0];
  const requestedEpisode = firstQueryValue(query.episode);
  const episode =
    server.episodes.find(({ slug }) => slug === requestedEpisode) ??
    server.episodes[0];

  return {
    servers: availableServers,
    server,
    episode,
  };
}

export function isCanonicalPlayerQuery(
  query: PlayerQuery,
  selection: PlayerSelection,
): boolean {
  return (
    firstQueryValue(query.server) === String(selection.server.index) &&
    firstQueryValue(query.episode) === selection.episode.slug &&
    !Array.isArray(query.server) &&
    !Array.isArray(query.episode)
  );
}

export function buildPlayerHref(
  movieSlug: string,
  serverIndex: number,
  episodeSlug: string,
): string {
  const query = new URLSearchParams({
    server: String(serverIndex),
    episode: episodeSlug,
  });

  return `/xem-phim/${encodeURIComponent(movieSlug)}?${query.toString()}`;
}
