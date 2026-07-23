import { z } from "zod";

const optionalText = z.string().nullish();
const optionalNumber = z.number().finite().nullish();

export const ophimTaxonomySchema = z.looseObject({
  _id: optionalText,
  id: optionalText,
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const ophimMovieSummarySchema = z.looseObject({
  _id: optionalText,
  name: z.string().min(1),
  slug: z.string().min(1),
  origin_name: optionalText,
  thumb_url: optionalText,
  poster_url: optionalText,
  type: optionalText,
  time: optionalText,
  episode_current: optionalText,
  quality: optionalText,
  lang: optionalText,
  year: optionalNumber,
  category: z.array(ophimTaxonomySchema).nullish(),
  country: z.array(ophimTaxonomySchema).nullish(),
});

export const ophimPaginationSchema = z.looseObject({
  totalItems: z.number().int().nonnegative().catch(0),
  totalItemsPerPage: z.number().int().positive().catch(24),
  currentPage: z.number().int().positive().catch(1),
  pageRanges: z.number().int().nonnegative().catch(0),
});

const ophimListDataSchema = z.looseObject({
  items: z.array(ophimMovieSummarySchema),
  params: z
    .looseObject({
      pagination: ophimPaginationSchema,
    })
    .optional(),
  APP_DOMAIN_CDN_IMAGE: optionalText,
});

export const ophimMovieListResponseSchema = z.looseObject({
  status: z.string(),
  message: z.string().optional(),
  data: ophimListDataSchema,
});

export const ophimTaxonomyResponseSchema = z.looseObject({
  status: z.string(),
  message: z.string().optional(),
  data: z.looseObject({
    items: z.array(ophimTaxonomySchema),
  }),
});

export const ophimEpisodeSchema = z.looseObject({
  name: z.string().min(1),
  slug: z.string().min(1),
  filename: optionalText,
  link_embed: optionalText,
  link_m3u8: optionalText,
});

export const ophimServerSchema = z.looseObject({
  server_name: z.string().min(1),
  is_ai: z.boolean().optional().catch(false),
  server_data: z.array(ophimEpisodeSchema),
});

export const ophimMovieDetailSchema = ophimMovieSummarySchema.extend({
  content: optionalText,
  status: optionalText,
  episode_total: optionalText,
  trailer_url: optionalText,
  actor: z.array(z.string()).nullish(),
  director: z.array(z.string()).nullish(),
  episodes: z.array(ophimServerSchema).nullish(),
});

export const ophimMovieDetailResponseSchema = z.looseObject({
  status: z.string(),
  message: z.string().optional(),
  data: z.looseObject({
    item: ophimMovieDetailSchema,
    APP_DOMAIN_CDN_IMAGE: optionalText,
  }),
});

export type OPhimMovieSummaryRaw = z.infer<typeof ophimMovieSummarySchema>;
export type OPhimMovieDetailRaw = z.infer<typeof ophimMovieDetailSchema>;
export type OPhimTaxonomyRaw = z.infer<typeof ophimTaxonomySchema>;
export type OPhimListResponseRaw = z.infer<
  typeof ophimMovieListResponseSchema
>;
export type OPhimDetailResponseRaw = z.infer<
  typeof ophimMovieDetailResponseSchema
>;
