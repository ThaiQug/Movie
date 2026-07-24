import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMovieCategories, getMovieCountries } from "../endpoints";

function taxonomyResponse(name: string, slug: string): Response {
  return new Response(
    JSON.stringify({
      status: "success",
      data: {
        items: [{ _id: `id-${slug}`, name, slug }],
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

describe("OPhim taxonomy endpoints", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches and adapts movie categories with a 24-hour cache", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(taxonomyResponse("Hành Động", "hanh-dong"));

    await expect(getMovieCategories()).resolves.toEqual([
      {
        id: "id-hanh-dong",
        name: "Hành Động",
        slug: "hanh-dong",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("https://ophim1.com/v1/api/the-loai"),
      expect.objectContaining({
        next: { revalidate: 86_400 },
      }),
    );
  });

  it("fetches and adapts movie countries with a 24-hour cache", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(taxonomyResponse("Hàn Quốc", "han-quoc"));

    await expect(getMovieCountries()).resolves.toEqual([
      {
        id: "id-han-quoc",
        name: "Hàn Quốc",
        slug: "han-quoc",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("https://ophim1.com/v1/api/quoc-gia"),
      expect.objectContaining({
        next: { revalidate: 86_400 },
      }),
    );
  });
});
