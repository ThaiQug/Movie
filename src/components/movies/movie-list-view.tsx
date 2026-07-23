import type { PaginatedMovies } from "@/lib/ophim";
import { MovieGrid } from "./movie-grid";
import { Pagination } from "./pagination";
import { SectionState } from "@/components/ui/section-state";

interface MovieListViewProps {
  title: string;
  description: string;
  result: PaginatedMovies;
  pathname: string;
  query?: Record<string, string>;
}

export function MovieListView({
  title,
  description,
  result,
  pathname,
  query,
}: MovieListViewProps) {
  return (
    <div className="page-container py-10 sm:py-14">
      <header className="mb-9 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
          Thư viện Cinematic
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-500 sm:text-base">
          {description}
        </p>
      </header>

      {result.items.length > 0 ? (
        <MovieGrid movies={result.items} />
      ) : (
        <SectionState
          title="Không tìm thấy phim"
          description="Danh mục này chưa có nội dung hoặc trang hiện tại vượt quá phạm vi. Hãy chọn một trang hợp lệ bên dưới."
        />
      )}
      {result.pagination.totalItems > 0 ? (
        <Pagination
          pagination={result.pagination}
          pathname={pathname}
          query={query}
        />
      ) : null}
    </div>
  );
}
