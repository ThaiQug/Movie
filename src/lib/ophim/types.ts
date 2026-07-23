export interface MovieTaxonomy {
  id?: string;
  name: string;
  slug: string;
}

export interface MovieSummary {
  id: string;
  name: string;
  originalName?: string;
  slug: string;
  /** OPhim poster_url: usually a landscape image suited to backdrops. */
  posterUrl: string;
  /** OPhim thumb_url: usually portrait artwork suited to 2:3 cards. */
  thumbnailUrl: string;
  year?: number;
  quality?: string;
  language?: string;
  currentEpisode?: string;
  duration?: string;
  type?: string;
  categories: MovieTaxonomy[];
  countries: MovieTaxonomy[];
}

export interface MovieEpisode {
  name: string;
  slug: string;
  filename?: string;
  m3u8Url?: string;
  embedUrl?: string;
}

export interface MovieServer {
  name: string;
  isAi: boolean;
  episodes: MovieEpisode[];
}

export interface MovieDetail extends MovieSummary {
  contentHtml?: string;
  status?: string;
  totalEpisodes?: string;
  trailerUrl?: string;
  actors: string[];
  directors: string[];
  servers: MovieServer[];
}

export interface MoviePagination {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  pageRanges: number;
}

export interface PaginatedMovies {
  items: MovieSummary[];
  pagination: MoviePagination;
}

export type MovieListKind = "phim-bo" | "phim-le" | "hoat-hinh";

export type MovieSortField =
  | "modified.time"
  | "_id"
  | "year"
  | "view"
  | "tmdb.vote_average";

export type MovieSortType = "asc" | "desc";

export interface MovieListQuery {
  page?: number;
  limit?: number;
  year?: number;
  category?: string;
  country?: string;
  sortField?: MovieSortField;
  sortType?: MovieSortType;
}

export interface MovieSearchQuery extends MovieListQuery {
  keyword: string;
}
