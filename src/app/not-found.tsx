import Link from "next/link";
import { SectionState } from "@/components/ui/section-state";

export default function NotFound() {
  return (
    <div className="page-container py-20">
      <SectionState
        title="Không tìm thấy trang"
        description="Bộ phim hoặc trang bạn tìm kiếm không tồn tại hay đã được chuyển đi."
      />
      <div className="mt-5 text-center">
        <Link
          href="/"
          className="inline-flex rounded-full bg-red-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-400"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
