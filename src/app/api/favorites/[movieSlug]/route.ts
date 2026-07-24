import { auth } from "@/auth";
import { removeFavorite } from "@/lib/favorites/repository";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/favorites/[movieSlug]">,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { error: "Bạn cần đăng nhập." },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const { movieSlug } = await context.params;
  await removeFavorite(session.user.id, movieSlug);

  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "private, no-store" },
  });
}

