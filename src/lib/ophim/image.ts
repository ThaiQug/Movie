const DEFAULT_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const DEFAULT_OPHIM_IMAGE_BASE_URL = "https://img.ophim.live";

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isAllowedAbsoluteImage(
  imageValue: string,
  configuredBaseUrl?: string,
): boolean {
  try {
    const imageUrl = new URL(imageValue);
    const allowedUrl = new URL(
      configuredBaseUrl || DEFAULT_OPHIM_IMAGE_BASE_URL,
    );
    return (
      imageUrl.protocol === "https:" &&
      allowedUrl.protocol === "https:" &&
      imageUrl.origin === allowedUrl.origin
    );
  } catch {
    return false;
  }
}

export function resolveMovieImage(
  value?: string | null,
  baseUrl?: string | null,
): string {
  const imageValue = value?.trim();

  if (!imageValue) {
    return DEFAULT_PLACEHOLDER;
  }

  const configuredBaseUrl =
    baseUrl?.trim() || process.env.OPHIM_IMAGE_BASE_URL?.trim();

  if (isHttpUrl(imageValue)) {
    return isAllowedAbsoluteImage(imageValue, configuredBaseUrl)
      ? imageValue
      : DEFAULT_PLACEHOLDER;
  }

  if (!configuredBaseUrl || !isHttpUrl(configuredBaseUrl)) {
    return DEFAULT_PLACEHOLDER;
  }

  try {
    const cdnUrl = new URL(configuredBaseUrl);
    const relativeImage = imageValue.replace(/^\/+/, "");
    const isBareFilename = !relativeImage.includes("/");

    if (isBareFilename && cdnUrl.pathname === "/") {
      cdnUrl.pathname = "/uploads/movies/";
    } else if (!cdnUrl.pathname.endsWith("/")) {
      cdnUrl.pathname += "/";
    }

    return new URL(relativeImage, cdnUrl).toString();
  } catch {
    return DEFAULT_PLACEHOLDER;
  }
}

export const MOVIE_IMAGE_PLACEHOLDER = DEFAULT_PLACEHOLDER;
