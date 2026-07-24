const FALLBACK_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "Cinematic";
export const SITE_DESCRIPTION =
  "Khám phá phim mới, phim bộ, phim lẻ và hoạt hình trên Cinematic.";

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  try {
    return new URL(configuredUrl || FALLBACK_SITE_URL);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}
