import { beforeEach, describe, expect, it, vi } from "vitest";

const favoriteMock = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  upsert: vi.fn(),
  deleteMany: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  db: { favorite: favoriteMock },
}));

import {
  findFavorite,
  listFavorites,
  removeFavorite,
  saveFavorite,
} from "../repository";

describe("favorite repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists only the current user's favorites newest first", async () => {
    favoriteMock.findMany.mockResolvedValue([]);

    await listFavorites("user-1");

    expect(favoriteMock.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      }),
    );
  });

  it("looks up a favorite through the compound user and movie key", async () => {
    favoriteMock.findUnique.mockResolvedValue(null);

    await findFavorite("user-1", "phim-hay");

    expect(favoriteMock.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_movieSlug: {
            userId: "user-1",
            movieSlug: "phim-hay",
          },
        },
      }),
    );
  });

  it("upserts movie metadata without changing ownership", async () => {
    favoriteMock.upsert.mockResolvedValue({ id: "favorite-1" });
    const input = {
      movieSlug: "phim-hay",
      movieName: "Phim hay",
      moviePosterUrl: "https://img.ophim.live/uploads/phim-hay.jpg",
    };

    await saveFavorite("user-1", input);

    expect(favoriteMock.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_movieSlug: {
            userId: "user-1",
            movieSlug: "phim-hay",
          },
        },
        create: expect.objectContaining({ userId: "user-1", ...input }),
        update: {
          movieName: input.movieName,
          moviePosterUrl: input.moviePosterUrl,
        },
      }),
    );
  });

  it("scopes deletion to both user and movie", async () => {
    favoriteMock.deleteMany.mockResolvedValue({ count: 1 });

    await removeFavorite("user-1", "phim-hay");

    expect(favoriteMock.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", movieSlug: "phim-hay" },
    });
  });
});
