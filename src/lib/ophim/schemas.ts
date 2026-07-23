import { z } from "zod";

const optionalText = z.string().nullish();
const optionalNumber = z.number().finite().nullish();
const requiredText = z.string().trim().min(1);

export const ophimTaxonomySchema = z.looseObject({
  _id: optionalText,
  id: optionalText,
  name: requiredText,
  slug: requiredText,
});

export const ophimMovieSummarySchema = z.looseObject({
  _id: optionalText,
  name: requiredText,
  slug: requiredText,
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
  totalItems: z.number().int().nonnegative().optional(),
  totalItemsPerPage: z.number().int().positive().optional(),
  currentPage: z.number().int().positive().optional(),
  pageRanges: z.number().int().nonnegative().optional(),
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
  status: z.literal("success"),
  message: z.string().optional(),
  data: ophimListDataSchema,
});

export const ophimTaxonomyResponseSchema = z.looseObject({
  status: z.literal("success"),
  message: z.string().optional(),
  data: z.looseObject({
    items: z.array(ophimTaxonomySchema),
  }),
});

export const ophimEpisodeSchema = z.looseObject({
  name: requiredText,
  slug: requiredText,
  filename: optionalText,
  link_embed: optionalText,
  link_m3u8: optionalText,
});

export const ophimServerSchema = z.looseObject({
  server_name: requiredText,
  is_ai: z.boolean().optional().default(false),
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
  status: z.literal("success"),
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
