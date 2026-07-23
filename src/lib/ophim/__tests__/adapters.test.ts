import { describe, expect, it } from "vitest";
import { adaptMovieDetail, adaptMovieList } from "../adapters";
import movieDetailFixture from "./fixtures/movie-detail.json";
import movieListFixture from "./fixtures/movie-list.json";
import {
  ophimMovieDetailResponseSchema,
  ophimMovieListResponseSchema,
} from "../schemas";

describe("OPhim adapters", () => {
  it("normalizes list responses and CDN image paths", () => {
    const parsed = ophimMovieListResponseSchema.parse(movieListFixture);
    const result = adaptMovieList(parsed);

    expect(result.pagination.totalItems).toBe(36024);
    expect(result.items[0]).toMatchObject({
      id: "6a618f86b468d7d317f08284",
      name: "Cái Chết của Robin Hood",
      originalName: "The Death of Robin Hood",
      slug: "cai-chet-cua-robin-hood",
      posterUrl:
        "https://img.ophim.live/uploads/movies/cai-chet-cua-robin-hood-poster.jpg",
      thumbnailUrl:
        "https://img.ophim.live/uploads/movies/cai-chet-cua-robin-hood-thumb.jpg",
      year: 2026,
      categories: [
        {
          id: "620a21b2e0fc277084dfd0c5",
          name: "Hành Động",
          slug: "hanh-dong",
        },
      ],
    });
  });

  it("normalizes episode servers without exposing upstream field names", () => {
    const parsed = ophimMovieDetailResponseSchema.parse(movieDetailFixture);
    const result = adaptMovieDetail(parsed);

    expect(result.actors).toEqual(["Hugh Jackman"]);
    expect(result.servers[0].episodes[0]).toEqual({
      name: "Full",
      slug: "full",
      filename: "Cái Chết của Robin Hood",
      m3u8Url: "https://video.example.com/master.m3u8",
      embedUrl: "https://embed.example.com/cai-chet-cua-robin-hood",
    });
  });

  it("falls back to the thumbnail when OPhim returns an empty poster", () => {
    const parsed = ophimMovieListResponseSchema.parse({
      status: "success",
      data: {
        APP_DOMAIN_CDN_IMAGE: "https://img.ophim.live",
        items: [
          {
            _id: "movie-without-poster",
            name: "Phim không có poster riêng",
            slug: "phim-khong-co-poster-rieng",
            poster_url: "",
            thumb_url: "phim-khong-co-poster-rieng-thumb.jpg",
          },
        ],
      },
    });

    expect(adaptMovieList(parsed).items[0].posterUrl).toBe(
      "https://img.ophim.live/uploads/movies/phim-khong-co-poster-rieng-thumb.jpg",
    );
  });

  it("uses safe defaults when optional collections and pagination are absent", () => {
    const parsed = ophimMovieListResponseSchema.parse({
      status: "success",
      data: {
        items: [
          {
            name: "Phim tối giản",
            slug: "phim-toi-gian",
          },
        ],
      },
    });
    const result = adaptMovieList(parsed);

    expect(result.items[0]).toMatchObject({
      categories: [],
      countries: [],
    });
    expect(result.items[0].id).toHaveLength(24);
    expect(result.pagination).toEqual({
      totalItems: 1,
      itemsPerPage: 1,
      currentPage: 1,
      pageRanges: 0,
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
