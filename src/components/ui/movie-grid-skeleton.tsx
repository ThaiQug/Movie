interface MovieGridSkeletonProps {
  count?: number;
}

export function MovieGridSkeleton({ count = 12 }: MovieGridSkeletonProps) {
  return (
    <div
      className="grid animate-pulse grid-cols-2 gap-x-4 gap-y-8 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      aria-label="Đang tải danh sách phim"
      role="status"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] rounded-xl bg-white/7" />
          <div className="mt-3 h-4 w-4/5 rounded bg-white/7" />
          <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}
