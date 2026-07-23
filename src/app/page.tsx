import { Suspense } from "react";
import { HeroBanner } from "@/components/movies/hero-banner";
import { MovieSlider } from "@/components/movies/movie-slider";
import { SectionState } from "@/components/ui/section-state";
import {
  getHomeMovies,
  getMovieDetail,
  getMovieList,
  type MovieSummary,
  type PaginatedMovies,
} from "@/lib/ophim";
import { sanitizeMovieContent } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

interface HomeSection {
  title: string;
  eyebrow: string;
  href?: string;
  result: PromiseSettledResult<PaginatedMovies>;
}

function Section({ title, eyebrow, href, result }: HomeSection) {
  if (result.status === "rejected") {
    return (
      <section className="section-shell">
        <SectionState
          variant="error"
          title={`Không tải được ${title.toLocaleLowerCase("vi")}`}
          description="Nguồn dữ liệu đang tạm gián đoạn. Các khu vực khác vẫn hoạt động bình thường."
        />
      </section>
    );
  }

  if (result.value.items.length === 0) {
    return (
      <section className="section-shell">
        <SectionState
          title={`Chưa có ${title.toLocaleLowerCase("vi")}`}
          description="Hãy quay lại sau để xem các nội dung mới nhất."
        />
      </section>
    );
  }

  return (
    <MovieSlider
      title={title}
      eyebrow={eyebrow}
      href={href}
      movies={result.value.items.slice(0, 12)}
    />
  );
}

async function HomeHero({ movie }: { movie: MovieSummary }) {
  let detail: Awaited<ReturnType<typeof getMovieDetail>> | null = null;

  try {
    detail = await getMovieDetail(movie.slug);
  } catch {
    detail = null;
  }

  return detail ? (
      <HeroBanner
        movie={detail}
        backdropUrl={detail.posterUrl}
        description={sanitizeMovieContent(detail.contentHtml)}
      />
  ) : (
    <HeroBanner movie={movie} />
  );
}

export default async function HomePage() {
  const [latest, series, singles, animation] = await Promise.allSettled([
    getHomeMovies({ limit: 16 }),
    getMovieList("phim-bo", { limit: 12 }),
    getMovieList("phim-le", { limit: 12 }),
    getMovieList("hoat-hinh", { limit: 12 }),
  ]);

  const heroMovies: MovieSummary[] =
    latest.status === "fulfilled" ? latest.value.items : [];

  const sections: HomeSection[] = [
    {
      title: "Phim mới cập nhật",
      eyebrow: "Vừa lên sóng",
      result: latest,
    },
    {
      title: "Phim bộ nổi bật",
      eyebrow: "Câu chuyện dài tập",
      href: "/phim-bo",
      result: series,
    },
    {
      title: "Phim lẻ tuyển chọn",
      eyebrow: "Một tối trọn vẹn",
      href: "/phim-le",
      result: singles,
    },
    {
      title: "Hoạt hình đặc sắc",
      eyebrow: "Thế giới sắc màu",
      href: "/hoat-hinh",
      result: animation,
    },
  ];

  return (
    <>
      {heroMovies[0] ? (
        <Suspense fallback={<HeroBanner movie={heroMovies[0]} />}>
          <HomeHero movie={heroMovies[0]} />
        </Suspense>
      ) : (
        <div className="page-container pt-10">
          <SectionState
            variant="error"
            title="Chưa thể tải phim nổi bật"
            description="Bạn vẫn có thể khám phá các danh mục bên dưới."
          />
        </div>
      )}

      <div className="space-y-14 pb-20 pt-12 sm:space-y-16 sm:pt-14">
        {sections.map((section) => (
          <Section key={section.href ?? section.title} {...section} />
        ))}
      </div>
    </>
  );
}
