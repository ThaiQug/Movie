import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black/20">
      <div className="page-container grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-base font-black tracking-[0.16em]">
            CINE<span className="text-red-500">MATIC</span>
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Dữ liệu được tổng hợp từ nguồn bên thứ ba. Cinematic là dự án học
            tập và portfolio, không sở hữu hoặc lưu trữ nội dung phim.
          </p>
        </div>
        <div className="flex gap-5 text-sm text-zinc-400">
          <Link href="/phim-bo" className="hover:text-white">
            Phim bộ
          </Link>
          <Link href="/phim-le" className="hover:text-white">
            Phim lẻ
          </Link>
          <Link href="/tim-kiem" className="hover:text-white">
            Tìm kiếm
          </Link>
        </div>
      </div>
    </footer>
  );
}
