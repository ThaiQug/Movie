import { describe, expect, it } from "vitest";
import {
  buildMovieListQuery,
  buildMovieSearchQuery,
} from "../endpoints";

describe("OPhim query builders", () => {
  it("builds supported list filters and ignores invalid pagination", () => {
    const query = buildMovieListQuery({
      page: 2,
      limit: 24,
      year: 2025,
      country: "han-quoc",
      category: "tinh-cam",
      sortField: "modified.time",
      sortType: "desc",
    });

    expect(query).toBe(
      "?page=2&limit=24&year=2025&category=tinh-cam&country=han-quoc&sort_field=modified.time&sort_type=desc",
    );
    expect(buildMovieListQuery({ page: -1 })).toBe("");
  });

  it("normalizes spaces and encodes Vietnamese search terms", () => {
    const query = buildMovieSearchQuery({
      keyword: "  ma   trận  ",
      page: 1,
    });
    const params = new URLSearchParams(query);

    expect(params.get("keyword")).toBe("ma trận");
    expect(params.get("page")).toBe("1");
  });
});
