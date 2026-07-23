import { describe, expect, it } from "vitest";
import {
  MOVIE_IMAGE_PLACEHOLDER,
  resolveMovieImage,
} from "../image";

describe("resolveMovieImage", () => {
  it("keeps an absolute HTTPS image URL from the configured CDN", () => {
    expect(
      resolveMovieImage(
        "https://cdn.example.com/poster.jpg",
        "https://cdn.example.com",
      ),
    ).toBe("https://cdn.example.com/poster.jpg");
  });

  it("rejects an absolute image outside the configured CDN", () => {
    expect(
      resolveMovieImage(
        "https://untrusted.example/poster.jpg",
        "https://img.ophim.live",
      ),
    ).toBe(MOVIE_IMAGE_PLACEHOLDER);
    expect(
      resolveMovieImage(
        "http://img.ophim.live/poster.jpg",
        "https://img.ophim.live",
      ),
    ).toBe(MOVIE_IMAGE_PLACEHOLDER);
  });

  it("joins a relative image with the response CDN", () => {
    expect(
      resolveMovieImage(
        "/uploads/movies/poster.jpg",
        "https://img.ophim.live",
      ),
    ).toBe("https://img.ophim.live/uploads/movies/poster.jpg");
  });

  it("uses the OPhim movie directory when the API returns only a filename", () => {
    expect(
      resolveMovieImage(
        "cai-chet-cua-robin-hood-thumb.jpg",
        "https://img.ophim.live",
      ),
    ).toBe(
      "https://img.ophim.live/uploads/movies/cai-chet-cua-robin-hood-thumb.jpg",
    );
  });

  it("returns the placeholder for missing or unsafe values", () => {
    expect(resolveMovieImage()).toBe(MOVIE_IMAGE_PLACEHOLDER);
    expect(resolveMovieImage("javascript:alert(1)")).toBe(
      MOVIE_IMAGE_PLACEHOLDER,
    );
  });

  it("preserves a configured CDN path with or without a trailing slash", () => {
    expect(
      resolveMovieImage("poster.jpg", "https://cdn.example.com/uploads"),
    ).toBe("https://cdn.example.com/uploads/poster.jpg");
    expect(
      resolveMovieImage("poster.jpg", "https://cdn.example.com/uploads/"),
    ).toBe("https://cdn.example.com/uploads/poster.jpg");
  });
});
