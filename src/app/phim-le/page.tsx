import type { Metadata } from "next";
import { MovieListView } from "@/components/movies/movie-list-view";
import { getMovieList } from "@/lib/ophim";
import { positivePage, type SearchParams } from "@/lib/page-params";

export const metadata: Metadata = { title: "Phim lẻ" };

export default async function SingleMoviesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const page = positivePage((await searchParams).page);
  const result = await getMovieList("phim-le", { page, limit: 24 });

  return (
    <MovieListView
      title="Phim lẻ"
      description="Tuyển chọn những bộ phim điện ảnh cho một trải nghiệm trọn vẹn."
      result={result}
      pathname="/phim-le"
    />
  );
}
