import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";

export default function Loading() {
  return (
    <div className="page-container py-12">
      <div className="mb-10 animate-pulse">
        <div className="h-3 w-28 rounded bg-red-400/20" />
        <div className="mt-4 h-10 w-64 max-w-full rounded bg-white/8" />
        <div className="mt-4 h-4 w-96 max-w-full rounded bg-white/5" />
      </div>
      <MovieGridSkeleton />
    </div>
  );
}
