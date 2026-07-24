export default function WatchMovieLoading() {
  return (
    <main className="page-container animate-pulse py-8 sm:py-12">
      <div className="h-4 w-28 rounded bg-white/5" />
      <div className="mt-4 h-9 w-72 max-w-full rounded bg-white/8" />
      <div className="mt-6 aspect-video w-full rounded-2xl bg-zinc-900" />
      <div className="mt-8 h-36 rounded-2xl border border-white/5 bg-white/[0.02]" />
    </main>
  );
}
