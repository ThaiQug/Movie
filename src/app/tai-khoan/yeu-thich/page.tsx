import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  FavoriteList,
  type FavoriteListItem,
} from "@/components/favorites/favorite-list";
import { listFavorites } from "@/lib/favorites/repository";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/yeu-thich");
  }

  const favorites = await listFavorites(session.user.id);
  const serializedFavorites: FavoriteListItem[] = favorites.map((favorite) => ({
    ...favorite,
    createdAt: favorite.createdAt.toISOString(),
  }));

  return (
    <section className="page-container py-12 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
        Bộ sưu tập
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        Phim yêu thích
      </h1>
      <p className="mt-3 text-sm text-zinc-500">
        {favorites.length} phim đã lưu
      </p>
      <div className="mt-9">
        <FavoriteList initialFavorites={serializedFavorites} />
      </div>
    </section>
  );
}

