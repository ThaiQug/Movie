const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

function decodeEntity(entity: string): string {
  if (entity.startsWith("#x") || entity.startsWith("#X")) {
    const codePoint = Number.parseInt(entity.slice(2), 16);
    return Number.isSafeInteger(codePoint) &&
      codePoint >= 0 &&
      codePoint <= 0x10ffff
      ? String.fromCodePoint(codePoint)
      : "";
  }
  if (entity.startsWith("#")) {
    const codePoint = Number.parseInt(entity.slice(1), 10);
    return Number.isSafeInteger(codePoint) &&
      codePoint >= 0 &&
      codePoint <= 0x10ffff
      ? String.fromCodePoint(codePoint)
      : "";
  }
  return NAMED_ENTITIES[entity.toLocaleLowerCase()] ?? "";
}

export function sanitizeMovieContent(content?: string): string {
  if (!content) return "";

  return content
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&([a-zA-Z]+|#[xX]?[0-9a-fA-F]+);/g, (_, entity: string) =>
      decodeEntity(entity),
    )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
