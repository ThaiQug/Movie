import type { Metadata } from "next";
import { MovieGrid } from "@/components/movies/movie-grid";
import { Pagination } from "@/components/movies/pagination";
import { SearchBar } from "@/components/search/search-bar";
import { SectionState } from "@/components/ui/section-state";
import { searchMovies } from "@/lib/ophim";
import {
  firstParam,
  positivePage,
  type SearchParams,
} from "@/lib/page-params";

export const metadata: Metadata = { title: "Tìm kiếm phim" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = firstParam(params.q).trim().replace(/\s+/g, " ");
  const page = positivePage(params.page);
  const result = query
    ? await searchMovies({ keyword: query, page, limit: 24 })
    : null;

  return (
    <div className="page-container py-10 sm:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
          Tìm trong thư viện
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
          Hôm nay bạn muốn xem gì?
        </h1>
        <div className="mt-8 text-left">
          <SearchBar initialQuery={query} />
        </div>
      </header>

      <section className="mt-12">
        {!query ? (
          <SectionState
            title="Bắt đầu bằng tên một bộ phim"
            description="Kết quả sẽ tự động cập nhật sau khi bạn dừng nhập."
          />
        ) : result && result.items.length > 0 ? (
          <>
            <div className="mb-7 flex items-end justify-between gap-4">
              <h2 className="text-xl font-bold sm:text-2xl">
                Kết quả cho “{query}”
              </h2>
              <span className="text-sm text-zinc-500">
                {result.pagination.totalItems.toLocaleString("vi-VN")} phim
              </span>
            </div>
            <MovieGrid movies={result.items} />
            <Pagination
              pagination={result.pagination}
              pathname="/tim-kiem"
              query={{ q: query }}
            />
          </>
        ) : result ? (
          <>
            <SectionState
              title={`Không có kết quả cho “${query}”`}
              description="Thử kiểm tra chính tả, dùng từ khóa ngắn hơn hoặc quay về trang kết quả hợp lệ."
            />
            {result.pagination.totalItems > 0 ? (
              <Pagination
                pagination={result.pagination}
                pathname="/tim-kiem"
                query={{ q: query }}
              />
            ) : null}
          </>
        ) : (
          <SectionState
            title="Chưa có dữ liệu tìm kiếm"
            description="Hãy nhập tên phim để bắt đầu."
          />
        )}
      </section>
    </div>
  );
}
