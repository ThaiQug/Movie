import type { Metadata } from "next";
import { MovieListView } from "@/components/movies/movie-list-view";
import { getMovieList } from "@/lib/ophim";
import { positivePage, type SearchParams } from "@/lib/page-params";

export const metadata: Metadata = {
  title: "Phim bộ",
  alternates: {
    canonical: "/phim-bo",
  },
};

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const page = positivePage((await searchParams).page);
  const result = await getMovieList("phim-bo", { page, limit: 24 });

  return (
    <MovieListView
      title="Phim bộ"
      description="Theo dõi những câu chuyện dài tập cuốn hút, từ châu Á đến Âu Mỹ."
      result={result}
      pathname="/phim-bo"
    />
  );
}
