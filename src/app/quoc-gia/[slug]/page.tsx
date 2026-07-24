import type { Metadata } from "next";
import { MovieListView } from "@/components/movies/movie-list-view";
import { getMoviesByCountry } from "@/lib/ophim";
import {
  positivePage,
  titleFromSlug,
  type SearchParams,
} from "@/lib/page-params";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Phim ${titleFromSlug(slug)}`,
    alternates: {
      canonical: `/quoc-gia/${encodeURIComponent(slug)}`,
    },
  };
}

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
