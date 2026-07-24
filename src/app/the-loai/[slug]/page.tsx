import type { Metadata } from "next";
import { MovieListView } from "@/components/movies/movie-list-view";
import { getMoviesByCategory } from "@/lib/ophim";
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
    title: `Thể loại ${titleFromSlug(slug)}`,
    alternates: {
      canonical: `/the-loai/${encodeURIComponent(slug)}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const page = positivePage((await searchParams).page);
  const result = await getMoviesByCategory(slug, { page, limit: 24 });
  const taxonomy = result.items
    .flatMap((movie) => movie.categories)
    .find((item) => item.slug === slug);
  const title = taxonomy?.name ?? titleFromSlug(slug);

  return (
    <MovieListView
      title={title}
      description={`Khám phá các tựa phim thuộc thể loại ${title.toLocaleLowerCase("vi")}.`}
      result={result}
      pathname={`/the-loai/${slug}`}
    />
  );
}
