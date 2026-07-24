import { auth } from "@/auth";
import {
  listFavorites,
  saveFavorite,
} from "@/lib/favorites/repository";
import { favoriteInputSchema } from "@/lib/favorites/validation";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "private, no-store",
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { error: "Bạn cần đăng nhập." },
      { status: 401, headers: noStoreHeaders },
    );
  }

  const favorites = await listFavorites(session.user.id);
  return Response.json({ favorites }, { headers: noStoreHeaders });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { error: "Bạn cần đăng nhập." },
      { status: 401, headers: noStoreHeaders },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Dữ liệu gửi lên không hợp lệ." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const parsed = favoriteInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Thông tin phim không hợp lệ." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const favorite = await saveFavorite(session.user.id, parsed.data);
  return Response.json(
    { favorite },
    { status: 201, headers: noStoreHeaders },
  );
}

