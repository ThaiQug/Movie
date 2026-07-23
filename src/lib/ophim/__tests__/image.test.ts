import { describe, expect, it } from "vitest";
import {
  MOVIE_IMAGE_PLACEHOLDER,
  resolveMovieImage,
} from "../image";

describe("resolveMovieImage", () => {
  it("keeps an absolute HTTP image URL", () => {
    expect(
      resolveMovieImage("https://cdn.example.com/poster.jpg", "https://ignored.test"),
    ).toBe("https://cdn.example.com/poster.jpg");
  });

  it("joins a relative image with the response CDN", () => {
    expect(
      resolveMovieImage(
        "/uploads/movies/poster.jpg",
        "https://img.ophim.live",
      ),
    ).toBe("https://img.ophim.live/uploads/movies/poster.jpg");
  });

  it("returns the placeholder for missing or unsafe values", () => {
    expect(resolveMovieImage()).toBe(MOVIE_IMAGE_PLACEHOLDER);
    expect(resolveMovieImage("javascript:alert(1)")).toBe(
      MOVIE_IMAGE_PLACEHOLDER,
    );
  });
});
