import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "../header";

const dependencies = vi.hoisted(() => ({
  auth: vi.fn(),
  getMovieCategories: vi.fn(),
  getMovieCountries: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: dependencies.auth,
}));

vi.mock("@/lib/ophim", () => ({
  getMovieCategories: dependencies.getMovieCategories,
  getMovieCountries: dependencies.getMovieCountries,
}));

describe("Header data loading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dependencies.auth.mockResolvedValue(null);
    dependencies.getMovieCategories.mockResolvedValue([]);
    dependencies.getMovieCountries.mockResolvedValue([]);
  });

  it("keeps successful taxonomy data when the other request fails", async () => {
    const countries = [{ name: "Hàn Quốc", slug: "han-quoc" }];
    dependencies.getMovieCategories.mockRejectedValue(
      new Error("categories unavailable"),
    );
    dependencies.getMovieCountries.mockResolvedValue(countries);

    const result = await Header();

    expect(result.props).toMatchObject({
      categories: [],
      categoriesUnavailable: true,
      countries,
      countriesUnavailable: false,
      user: null,
    });
  });

  it("falls back independently when both taxonomy requests fail", async () => {
    dependencies.getMovieCategories.mockRejectedValue(new Error("offline"));
    dependencies.getMovieCountries.mockRejectedValue(new Error("offline"));

    const result = await Header();

    expect(result.props).toMatchObject({
      categories: [],
      categoriesUnavailable: true,
      countries: [],
      countriesUnavailable: true,
    });
  });
});
