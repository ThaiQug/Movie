import type { Metadata } from "next";
import { MovieListView } from "@/components/movies/movie-list-view";
import { getMovieList } from "@/lib/ophim";
import { positivePage, type SearchParams } from "@/lib/page-params";

export const metadata: Metadata = { title: "Hoạt hình" };

export default async function AnimationPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const page = positivePage((await searchParams).page);
  const result = await getMovieList("hoat-hinh", { page, limit: 24 });

  return (
    <MovieListView
      title="Hoạt hình"
      description="Khám phá thế giới hoạt hình đầy màu sắc dành cho mọi độ tuổi."
      result={result}
      pathname="/hoat-hinh"
    />
  );
}
