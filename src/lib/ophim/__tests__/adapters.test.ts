import { describe, expect, it } from "vitest";
import { adaptMovieDetail, adaptMovieList } from "../adapters";
import {
  ophimMovieDetailResponseSchema,
  ophimMovieListResponseSchema,
} from "../schemas";

const listFixture: unknown = {
  status: "success",
  data: {
    APP_DOMAIN_CDN_IMAGE: "https://img.ophim.live",
    items: [
      {
        _id: "movie-1",
        name: "Ma Trận",
        slug: "ma-tran",
        origin_name: "The Matrix",
        thumb_url: "ma-tran-thumb.jpg",
        poster_url: "/uploads/movies/ma-tran-poster.jpg",
        episode_current: "Full",
        quality: "HD",
        lang: "Vietsub",
        year: 1999,
        category: [{ _id: "category-1", name: "Hành Động", slug: "hanh-dong" }],
        country: [{ _id: "country-1", name: "Âu Mỹ", slug: "au-my" }],
      },
    ],
    params: {
      pagination: {
        totalItems: 1,
        totalItemsPerPage: 24,
        currentPage: 1,
        pageRanges: 1,
      },
    },
  },
};

const detailFixture: unknown = {
  status: "success",
  data: {
    APP_DOMAIN_CDN_IMAGE: "https://img.ophim.live",
    item: {
      _id: "movie-1",
      name: "Ma Trận",
      slug: "ma-tran",
      origin_name: "The Matrix",
      content: "<p>Một hacker khám phá sự thật.</p>",
      thumb_url: "ma-tran-thumb.jpg",
      year: 1999,
      actor: ["Keanu Reeves"],
      director: ["Lana Wachowski", "Lilly Wachowski"],
      category: [],
      country: [],
      episodes: [
        {
          server_name: "Vietsub",
          is_ai: false,
          server_data: [
            {
              name: "Full",
              slug: "full",
              filename: "Ma Trận",
              link_m3u8: "https://video.example.com/master.m3u8",
              link_embed: "https://embed.example.com/ma-tran",
            },
          ],
        },
      ],
    },
  },
};

describe("OPhim adapters", () => {
  it("normalizes list responses and CDN image paths", () => {
    const parsed = ophimMovieListResponseSchema.parse(listFixture);
    const result = adaptMovieList(parsed);

    expect(result.pagination.totalItems).toBe(1);
    expect(result.items[0]).toMatchObject({
      id: "movie-1",
      name: "Ma Trận",
      originalName: "The Matrix",
      slug: "ma-tran",
      posterUrl: "https://img.ophim.live/uploads/movies/ma-tran-poster.jpg",
      year: 1999,
    });
  });

  it("normalizes episode servers without exposing upstream field names", () => {
    const parsed = ophimMovieDetailResponseSchema.parse(detailFixture);
    const result = adaptMovieDetail(parsed);

    expect(result.servers[0].episodes[0]).toEqual({
      name: "Full",
      slug: "full",
      filename: "Ma Trận",
      m3u8Url: "https://video.example.com/master.m3u8",
      embedUrl: "https://embed.example.com/ma-tran",
    });
  });

  it("rejects a response without essential movie identity fields", () => {
    const invalid = {
      status: "success",
      data: {
        items: [{ name: "Thiếu slug" }],
      },
    };

    expect(ophimMovieListResponseSchema.safeParse(invalid).success).toBe(false);
  });
});
