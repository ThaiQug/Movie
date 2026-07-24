import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  listFavorites: vi.fn(),
  saveFavorite: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/favorites/repository", () => ({
  listFavorites: mocks.listFavorites,
  saveFavorite: mocks.saveFavorite,
}));

import { GET, POST } from "../route";

describe("favorites API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests without touching the repository", async () => {
    mocks.auth.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(mocks.listFavorites).not.toHaveBeenCalled();
  });

  it("returns only favorites belonging to the authenticated user", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.listFavorites.mockResolvedValue([{ id: "favorite-1" }]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(mocks.listFavorites).toHaveBeenCalledWith("user-1");
    await expect(response.json()).resolves.toEqual({
      favorites: [{ id: "favorite-1" }],
    });
  });

  it("validates favorite payloads before writing", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new Request("http://localhost/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieSlug: "../invalid" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mocks.saveFavorite).not.toHaveBeenCalled();
  });

  it("saves a valid movie for the authenticated user", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    const movie = {
      movieSlug: "phim-hay",
      movieName: "Phim hay",
      moviePosterUrl: "https://img.ophim.live/uploads/phim-hay.jpg",
    };
    mocks.saveFavorite.mockResolvedValue({ id: "favorite-1", ...movie });
    const request = new Request("http://localhost/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(mocks.saveFavorite).toHaveBeenCalledWith("user-1", movie);
  });
});
