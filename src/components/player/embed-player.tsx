"use client";

interface EmbedPlayerProps {
  source: string;
  title: string;
  onError: () => void;
}

export function EmbedPlayer({
  source,
  title,
  onError,
}: EmbedPlayerProps) {
  return (
    <iframe
      src={source}
      title={title}
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      loading="eager"
      referrerPolicy="no-referrer"
      sandbox="allow-scripts allow-same-origin allow-presentation"
      onError={onError}
      className="aspect-video size-full border-0 bg-black"
    />
  );
}
