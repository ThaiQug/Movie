const DEFAULT_AUTHENTICATED_PATH = "/tai-khoan";

export function safeCallbackPath(
  value: string | null | undefined,
): string {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTHENTICATED_PATH;
  }

  return value;
}

export function safeRedirectUrl(url: string, baseUrl: string): string {
  if (url.startsWith("/") && !url.startsWith("//")) {
    return new URL(url, baseUrl).toString();
  }

  try {
    const destination = new URL(url);
    return destination.origin === new URL(baseUrl).origin
      ? destination.toString()
      : baseUrl;
  } catch {
    return baseUrl;
  }
}

