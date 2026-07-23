import type { MovieSummary } from "@/lib/ophim";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: MovieSummary[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} priority={index < 4} />
      ))}
    </div>
  );
}
