"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

interface HlsPlayerProps {
  source: string;
  poster?: string;
  title: string;
  onFallback: () => void;
}

export function HlsPlayer({
  source,
  poster,
  title,
  onFallback,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;
    const video: HTMLVideoElement = currentVideo;

    let hls: Hls | null = null;
    let disposed = false;
    let fallbackRequested = false;

    function detachSource() {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    function requestFallback() {
      if (disposed || fallbackRequested) return;
      fallbackRequested = true;
      hls?.destroy();
      hls = null;
      detachSource();
      onFallback();
    }

    function startHlsJs() {
      video.removeEventListener("error", startHlsJs);
      detachSource();

      if (!Hls.isSupported()) {
        requestFallback();
        return;
      }

      hls = new Hls({
        enableWorker: true,
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) requestFallback();
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.addEventListener("error", startHlsJs, { once: true });
      video.src = source;
    } else {
      startHlsJs();
    }

    return () => {
      disposed = true;
      video.removeEventListener("error", startHlsJs);
      hls?.destroy();
      hls = null;
      detachSource();
    };
  }, [onFallback, source]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={title}
      className="aspect-video size-full bg-black object-contain"
    />
  );
}
