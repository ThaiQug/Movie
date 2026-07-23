import { MovieListView } from "@/components/movies/movie-list-view";
import { getMoviesByCountry } from "@/lib/ophim";
import {
  positivePage,
  titleFromSlug,
  type SearchParams,
} from "@/lib/page-params";

export default async function CountryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const page = positivePage((await searchParams).page);
  const result = await getMoviesByCountry(slug, { page, limit: 24 });
  const taxonomy = result.items
    .flatMap((movie) => movie.countries)
    .find((item) => item.slug === slug);
  const title = taxonomy?.name ?? titleFromSlug(slug);

  return (
    <MovieListView
      title={`Phim ${title}`}
      description={`Tuyển chọn phim đến từ ${title}, cập nhật thường xuyên.`}
      result={result}
      pathname={`/quoc-gia/${slug}`}
    />
  );
}
