import { adaptMovieDetail, adaptMovieList, adaptTaxonomy } from "./adapters";
import { fetchOPhim } from "./client";
import {
  ophimMovieDetailResponseSchema,
  ophimMovieListResponseSchema,
  ophimTaxonomyResponseSchema,
} from "./schemas";
import type {
  MovieDetail,
  MovieListKind,
  MovieListQuery,
  MovieSearchQuery,
  MovieTaxonomy,
  PaginatedMovies,
} from "./types";

const CACHE = {
  detail: 120,
  list: 300,
  taxonomy: 86_400,
} as const;

function positiveInteger(value: number | undefined): string | undefined {
  if (value === undefined || !Number.isInteger(value) || value < 1) {
    return undefined;
  }

  return String(value);
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new RangeError(`${fieldName} must not be empty.`);
  }

  return normalized;
}

export function buildMovieListQuery(query: MovieListQuery = {}): string {
  const params = new URLSearchParams();
  const page = positiveInteger(query.page);
  const limit = positiveInteger(query.limit);
  const year = positiveInteger(query.year);

  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (year) params.set("year", year);
  if (query.category?.trim()) params.set("category", query.category.trim());
  if (query.country?.trim()) params.set("country", query.country.trim());
  if (query.sortField) params.set("sort_field", query.sortField);
  if (query.sortType) params.set("sort_type", query.sortType);

  const value = params.toString();
  return value ? `?${value}` : "";
}

export function buildMovieSearchQuery(query: MovieSearchQuery): string {
  const keyword = requiredText(
    query.keyword.trim().replace(/\s+/g, " "),
    "Search keyword",
  );
  const params = new URLSearchParams(
    buildMovieListQuery(query).replace(/^\?/, ""),
  );
  params.set("keyword", keyword);
  return `?${params.toString()}`;
}

async function fetchMovieList(path: string): Promise<PaginatedMovies> {
  const response = await fetchOPhim(
    path,
    ophimMovieListResponseSchema,
    { revalidate: CACHE.list },
  );
  return adaptMovieList(response);
}

async function fetchTaxonomy(path: string): Promise<MovieTaxonomy[]> {
  const response = await fetchOPhim(path, ophimTaxonomyResponseSchema, {
    revalidate: CACHE.taxonomy,
  });
  return response.data.items.map(adaptTaxonomy);
}

export function getMovieCategories(): Promise<MovieTaxonomy[]> {
  return fetchTaxonomy("/v1/api/the-loai");
}

export function getMovieCountries(): Promise<MovieTaxonomy[]> {
  return fetchTaxonomy("/v1/api/quoc-gia");
}

export function getHomeMovies(
  query: MovieListQuery = {},
): Promise<PaginatedMovies> {
  return fetchMovieList(`/v1/api/home${buildMovieListQuery(query)}`);
}

export function getMovieList(
  kind: MovieListKind,
  query: MovieListQuery = {},
): Promise<PaginatedMovies> {
  return fetchMovieList(
    `/v1/api/danh-sach/${encodeURIComponent(kind)}${buildMovieListQuery(query)}`,
  );
}

export function searchMovies(query: MovieSearchQuery): Promise<PaginatedMovies> {
  return fetchMovieList(`/v1/api/tim-kiem${buildMovieSearchQuery(query)}`);
}

export function getMoviesByCategory(
  slug: string,
  query: MovieListQuery = {},
): Promise<PaginatedMovies> {
  const normalizedSlug = requiredText(slug, "Category slug");
  return fetchMovieList(
    `/v1/api/the-loai/${encodeURIComponent(normalizedSlug)}${buildMovieListQuery(query)}`,
  );
}

export function getMoviesByCountry(
  slug: string,
  query: MovieListQuery = {},
): Promise<PaginatedMovies> {
  const normalizedSlug = requiredText(slug, "Country slug");
  return fetchMovieList(
    `/v1/api/quoc-gia/${encodeURIComponent(normalizedSlug)}${buildMovieListQuery(query)}`,
  );
}

export async function getMovieDetail(slug: string): Promise<MovieDetail> {
  const normalizedSlug = requiredText(slug, "Movie slug");
  const response = await fetchOPhim(
    `/v1/api/phim/${encodeURIComponent(normalizedSlug)}`,
    ophimMovieDetailResponseSchema,
    {
      revalidate: CACHE.detail,
      movieSlug: normalizedSlug,
    },
  );
  return adaptMovieDetail(response);
}
