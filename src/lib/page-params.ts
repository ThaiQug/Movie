export type SearchParamValue = string | string[] | undefined;
export type SearchParams = Record<string, SearchParamValue>;

export function firstParam(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function positivePage(value: SearchParamValue): number {
  const parsed = Number.parseInt(firstParam(value), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function titleFromSlug(slug: string): string {
  let decodedSlug = slug;

  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  return decodedSlug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase("vi") + part.slice(1))
    .join(" ");
}
