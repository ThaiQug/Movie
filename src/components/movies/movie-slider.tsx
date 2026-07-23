"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";
import type { MovieSummary } from "@/lib/ophim";
import { MovieCard } from "./movie-card";

interface MovieSliderProps {
  title: string;
  eyebrow: string;
  href?: string;
  movies: MovieSummary[];
}

export function MovieSlider({
  title,
  eyebrow,
  href,
  movies,
}: MovieSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    trackRef.current?.scrollBy({
      left: direction * Math.min(trackRef.current.clientWidth * 0.85, 900),
      behavior: "smooth",
    });
  }

  return (
    <section className="section-shell">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {href ? (
            <Link
              href={href}
              className="mr-1 hidden text-sm font-medium text-zinc-400 hover:text-white sm:block"
            >
              Xem tất cả
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Cuộn ${title} sang trái`}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Cuộn ${title} sang phải`}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[calc((100%-1rem)/2)] shrink-0 snap-start min-[480px]:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-4rem)/5)] xl:w-[calc((100%-5rem)/6)]"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
