"use client";

import { useEffect } from "react";
import { SectionState } from "@/components/ui/section-state";

export default function ErrorPage({
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
    <div className="page-container py-20">
      <SectionState
        variant="error"
        title="Không thể tải dữ liệu"
        description="Nguồn phim đang tạm gián đoạn. Vui lòng thử lại sau ít phút."
      />
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-400"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
