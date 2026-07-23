import { getHomeMovies } from "@/lib/ophim";
import type { MovieSummary } from "@/lib/ophim";

export const dynamic = "force-dynamic";

async function loadPreview(): Promise<{
  movies: MovieSummary[];
  error?: string;
}> {
  try {
    const result = await getHomeMovies({ limit: 6 });
    return { movies: result.items.slice(0, 6) };
  } catch {
    return {
      movies: [],
      error:
        "OPhim hiện chưa phản hồi. Nền tảng vẫn sẵn sàng và sẽ tự thử lại ở lần tải sau.",
    };
  }
}

export default async function Home() {
  const { movies, error } = await loadPreview();

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090c] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <p className="text-xl font-bold tracking-[0.18em] text-red-500">
            CINEMATIC
          </p>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            Phase 1–2
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-red-400">
            Nền tảng đã sẵn sàng
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Kiến trúc vững chắc cho trải nghiệm điện ảnh tiếp theo.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Next.js, PostgreSQL, Prisma và lớp dữ liệu OPhim đã được tách biệt,
            xác thực và chuẩn hóa. Giao diện xem phim đầy đủ sẽ được xây dựng ở
            phase kế tiếp.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {["TypeScript strict", "PostgreSQL + Prisma", "OPhim adapter"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm text-zinc-300"
                >
                  <span className="mr-2 text-emerald-400">●</span>
                  {item}
                </div>
              ),
            )}
          </div>

          <div className="mt-12">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Kết nối dữ liệu thật
                </p>
                <h2 className="mt-2 text-xl font-medium">Phim mới từ OPhim</h2>
              </div>
              <span className="text-xs text-zinc-600">Không lưu trữ video</span>
            </div>

            {error ? (
              <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                {error}
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {movies.map((movie) => (
                  <li
                    key={movie.id}
                    className="rounded-xl border border-white/10 bg-zinc-900/70 p-4"
                  >
                    <p className="truncate font-medium">{movie.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {[movie.year, movie.quality, movie.language]
                        .filter(Boolean)
                        .join(" · ") || "Đang cập nhật"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <footer className="border-t border-white/10 pt-6 text-xs leading-5 text-zinc-600">
          Dữ liệu đến từ nguồn bên thứ ba. Cinematic là project học tập và
          portfolio, không sở hữu hoặc lưu trữ nội dung phim.
        </footer>
      </div>
    </main>
  );
}
