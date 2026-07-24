"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { EmbedPlayer } from "./embed-player";
import { HlsPlayer } from "./hls-player";
import { PlayerError } from "./player-error";

interface PlayerSurfaceProps {
  m3u8Url?: string;
  embedUrl?: string;
  poster?: string;
  title: string;
}

type PlayerStage = "hls" | "embed" | "error";

function initialStage(m3u8Url?: string, embedUrl?: string): PlayerStage {
  if (m3u8Url) return "hls";
  if (embedUrl) return "embed";
  return "error";
}

export function PlayerSurface({
  m3u8Url,
  embedUrl,
  poster,
  title,
}: PlayerSurfaceProps) {
  const router = useRouter();
  const [stage, setStage] = useState<PlayerStage>(() =>
    initialStage(m3u8Url, embedUrl),
  );
  const [attempt, setAttempt] = useState(0);

  const fallbackFromHls = useCallback(() => {
    setStage(embedUrl ? "embed" : "error");
  }, [embedUrl]);

  const retry = useCallback(() => {
    if (!m3u8Url && !embedUrl) {
      router.refresh();
      return;
    }

    setAttempt((value) => value + 1);
    setStage(initialStage(m3u8Url, embedUrl));
  }, [embedUrl, m3u8Url, router]);

  if (stage === "hls" && m3u8Url) {
    return (
      <HlsPlayer
        key={`${m3u8Url}-${attempt}`}
        source={m3u8Url}
        poster={poster}
        title={title}
        onFallback={fallbackFromHls}
      />
    );
  }

  if (stage === "embed" && embedUrl) {
    return (
      <EmbedPlayer
        key={`${embedUrl}-${attempt}`}
        source={embedUrl}
        title={title}
        onError={() => setStage("error")}
      />
    );
  }

  return <PlayerError onRetry={retry} />;
}
