"use client";

import { useEffect } from "react";
import { SectionState } from "@/components/ui/section-state";

export default function WatchMovieError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-container py-20">
      <SectionState
        variant="error"
        title="Không thể tải trình phát"
        description="Thông tin nguồn phim đang tạm gián đoạn. Vui lòng thử lại."
      />
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
        >
          Thử lại
        </button>
      </div>
    </main>
  );
}
