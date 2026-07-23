const DEFAULT_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
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

  if (isHttpUrl(imageValue)) {
    return imageValue;
  }

  const configuredBaseUrl =
    baseUrl?.trim() || process.env.OPHIM_IMAGE_BASE_URL?.trim();

  if (!configuredBaseUrl || !isHttpUrl(configuredBaseUrl)) {
    return DEFAULT_PLACEHOLDER;
  }

  try {
    return new URL(imageValue.replace(/^\/+/, ""), `${configuredBaseUrl}/`).toString();
  } catch {
    return DEFAULT_PLACEHOLDER;
  }
}

export const MOVIE_IMAGE_PLACEHOLDER = DEFAULT_PLACEHOLDER;
