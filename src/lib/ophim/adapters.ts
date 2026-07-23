import { createHash } from "node:crypto";
import { resolveMovieImage } from "./image";
import type {
  MovieDetail,
  MoviePagination,
  MovieServer,
  MovieSummary,
  MovieTaxonomy,
  PaginatedMovies,
} from "./types";
import type {
  OPhimDetailResponseRaw,
  OPhimListResponseRaw,
  OPhimMovieDetailRaw,
  OPhimMovieSummaryRaw,
  OPhimTaxonomyRaw,
} from "./schemas";

function compactText(value?: string | null): string | undefined {
  const text = value?.trim();
  return text ? text : undefined;
}

function stableMovieId(movie: OPhimMovieSummaryRaw): string {
  const upstreamId = compactText(movie._id);
  if (upstreamId) {
    return upstreamId;
  }

  return createHash("sha256").update(movie.slug).digest("hex").slice(0, 24);
}

export function adaptTaxonomy(item: OPhimTaxonomyRaw): MovieTaxonomy {
  return {
    id: compactText(item._id) ?? compactText(item.id),
    name: item.name.trim(),
    slug: item.slug.trim(),
  };
}

export function adaptMovieSummary(
  movie: OPhimMovieSummaryRaw,
  imageBaseUrl?: string | null,
): MovieSummary {
  const posterPath = compactText(movie.poster_url);
  const thumbnailPath = compactText(movie.thumb_url);

  return {
    id: stableMovieId(movie),
    name: movie.name.trim(),
    originalName: compactText(movie.origin_name),
    slug: movie.slug.trim(),
    posterUrl: resolveMovieImage(posterPath ?? thumbnailPath, imageBaseUrl),
    thumbnailUrl: resolveMovieImage(thumbnailPath ?? posterPath, imageBaseUrl),
    year: movie.year ?? undefined,
    quality: compactText(movie.quality),
    language: compactText(movie.lang),
    currentEpisode: compactText(movie.episode_current),
    duration: compactText(movie.time),
    type: compactText(movie.type),
    categories: (movie.category ?? []).map(adaptTaxonomy),
    countries: (movie.country ?? []).map(adaptTaxonomy),
  };
}

function adaptServer(
  server: NonNullable<OPhimMovieDetailRaw["episodes"]>[number],
): MovieServer {
  return {
    name: server.server_name.trim(),
    isAi: server.is_ai ?? false,
    episodes: server.server_data.map((episode) => ({
      name: episode.name.trim(),
      slug: episode.slug.trim(),
      filename: compactText(episode.filename),
      m3u8Url: compactText(episode.link_m3u8),
      embedUrl: compactText(episode.link_embed),
    })),
  };
}

export function adaptMovieDetail(
  response: OPhimDetailResponseRaw,
): MovieDetail {
  const movie = response.data.item;
  const summary = adaptMovieSummary(
    movie,
    response.data.APP_DOMAIN_CDN_IMAGE,
  );

  return {
    ...summary,
    contentHtml: compactText(movie.content),
    status: compactText(movie.status),
    totalEpisodes: compactText(movie.episode_total),
    trailerUrl: compactText(movie.trailer_url),
    actors: (movie.actor ?? []).map((actor) => actor.trim()).filter(Boolean),
    directors: (movie.director ?? [])
      .map((director) => director.trim())
      .filter(Boolean),
    servers: (movie.episodes ?? []).map(adaptServer),
  };
}

function adaptPagination(
  response: OPhimListResponseRaw,
  itemCount: number,
): MoviePagination {
  const pagination = response.data.params?.pagination;

  return {
    totalItems: pagination?.totalItems ?? itemCount,
    itemsPerPage: pagination?.totalItemsPerPage ?? itemCount,
    currentPage: pagination?.currentPage ?? 1,
    pageRanges: pagination?.pageRanges ?? 0,
  };
}

export function adaptMovieList(
  response: OPhimListResponseRaw,
): PaginatedMovies {
  const imageBaseUrl = response.data.APP_DOMAIN_CDN_IMAGE;
  const items = response.data.items.map((movie) =>
    adaptMovieSummary(movie, imageBaseUrl),
  );

  return {
    items,
    pagination: adaptPagination(response, items.length),
  };
}
