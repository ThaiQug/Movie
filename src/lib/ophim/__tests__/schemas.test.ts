import { describe, expect, it } from "vitest";
import { adaptTaxonomy } from "../adapters";
import {
  ophimMovieDetailResponseSchema,
  ophimMovieListResponseSchema,
  ophimTaxonomyResponseSchema,
} from "../schemas";
import movieDetailFixture from "./fixtures/movie-detail.json";
import movieListFixture from "./fixtures/movie-list.json";
import taxonomiesFixture from "./fixtures/taxonomies.json";

describe("OPhim response schemas", () => {
  it("accepts the verified list response contract", () => {
    expect(ophimMovieListResponseSchema.safeParse(movieListFixture).success).toBe(
      true,
    );
  });

  it("accepts the verified detail response contract", () => {
    expect(
      ophimMovieDetailResponseSchema.safeParse(movieDetailFixture).success,
    ).toBe(true);
  });

  it("supports taxonomy identifiers returned as _id or id", () => {
    const categories = ophimTaxonomyResponseSchema.parse(
      taxonomiesFixture.categories,
    );
    const itemWithId = ophimMovieListResponseSchema.parse(movieListFixture).data
      .items[0].category?.[0];

    expect(adaptTaxonomy(categories.data.items[0]).id).toBe(
      "620a21b2e0fc277084dfd0c5",
    );
    expect(itemWithId && adaptTaxonomy(itemWithId).id).toBe(
      "620a21b2e0fc277084dfd0c5",
    );
  });

  it("rejects non-numeric years instead of leaking unstable API data", () => {
    const invalid = structuredClone(movieListFixture);
    invalid.data.items[0].year = "2026" as unknown as number;

    expect(ophimMovieListResponseSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects unsuccessful status values and malformed pagination", () => {
    const unsuccessful = structuredClone(movieListFixture);
    unsuccessful.status = "error";

    const malformedPagination = structuredClone(movieListFixture);
    malformedPagination.data.params.pagination.currentPage = 0;

    expect(
      ophimMovieListResponseSchema.safeParse(unsuccessful).success,
    ).toBe(false);
    expect(
      ophimMovieListResponseSchema.safeParse(malformedPagination).success,
    ).toBe(false);
  });
});
