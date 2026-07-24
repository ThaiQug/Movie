export interface PlayableEpisode {
  name: string;
  slug: string;
  m3u8Url?: string;
  embedUrl?: string;
}

export interface PlayableServer {
  index: number;
  name: string;
  episodes: PlayableEpisode[];
}

export interface PlayerSelection {
  servers: PlayableServer[];
  server: PlayableServer;
  episode: PlayableEpisode;
}

export interface PlayerQuery {
  server?: string | string[];
  episode?: string | string[];
}
