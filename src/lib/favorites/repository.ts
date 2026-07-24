import "server-only";
import { db } from "@/lib/db/client";
import type { FavoriteInput } from "./validation";

const favoriteSelect = {
  id: true,
  movieSlug: true,
  movieName: true,
  moviePosterUrl: true,
  createdAt: true,
} as const;

export type FavoriteItem = Awaited<ReturnType<typeof listFavorites>>[number];

export function listFavorites(userId: string) {
  return db.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: favoriteSelect,
  });
}

export function findFavorite(userId: string, movieSlug: string) {
  return db.favorite.findUnique({
    where: {
      userId_movieSlug: { userId, movieSlug },
    },
    select: favoriteSelect,
  });
}

export function saveFavorite(userId: string, input: FavoriteInput) {
  return db.favorite.upsert({
    where: {
      userId_movieSlug: {
        userId,
        movieSlug: input.movieSlug,
      },
    },
    create: {
      userId,
      movieSlug: input.movieSlug,
      movieName: input.movieName,
      moviePosterUrl: input.moviePosterUrl,
    },
    update: {
      movieName: input.movieName,
      moviePosterUrl: input.moviePosterUrl,
    },
    select: favoriteSelect,
  });
}

export function removeFavorite(userId: string, movieSlug: string) {
  return db.favorite.deleteMany({
    where: { userId, movieSlug },
  });
}

