import Link from "next/link";
import type { MoviePagination } from "@/lib/ophim";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface PaginationProps {
  pagination: MoviePagination;
  pathname: string;
  query?: Record<string, string>;
}

function pageHref(
  pathname: string,
  page: number,
  query: Record<string, string>,
) {
  const params = new URLSearchParams(query);
  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

export function Pagination({
  pagination,
  pathname,
  query = {},
}: PaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(pagination.totalItems / Math.max(1, pagination.itemsPerPage)),
  );
  const currentPage = Math.min(Math.max(1, pagination.currentPage), totalPages);

  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );

  return (
    <nav className="mt-12 flex justify-center gap-2" aria-label="Phân trang">
      {currentPage > 1 ? (
        <Link
          href={pageHref(pathname, currentPage - 1, query)}
          className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          aria-label="Trang trước"
        >
          <ChevronLeftIcon className="size-4" />
        </Link>
      ) : null}

      {start > 1 ? (
        <>
          <Link
            href={pageHref(pathname, 1, query)}
            className="flex size-10 items-center justify-center rounded-full text-sm text-zinc-400 hover:bg-white/5"
          >
            1
          </Link>
          {start > 2 ? <span className="px-1 pt-2 text-zinc-600">…</span> : null}
        </>
      ) : null}

      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(pathname, page, query)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${
            page === currentPage
              ? "bg-red-500 text-white"
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {page}
        </Link>
      ))}

      {end < totalPages ? (
        <>
          {end < totalPages - 1 ? (
            <span className="px-1 pt-2 text-zinc-600">…</span>
          ) : null}
          <Link
            href={pageHref(pathname, totalPages, query)}
            className="flex size-10 items-center justify-center rounded-full text-sm text-zinc-400 hover:bg-white/5"
          >
            {totalPages}
          </Link>
        </>
      ) : null}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(pathname, currentPage + 1, query)}
          className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          aria-label="Trang sau"
        >
          <ChevronRightIcon className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}
