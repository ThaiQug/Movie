import { describe, expect, it } from "vitest";
import { sanitizeMovieContent } from "../sanitize";

describe("sanitizeMovieContent", () => {
  it("returns readable text without rendering upstream HTML", () => {
    expect(
      sanitizeMovieContent(
        "<p>Một bộ phim &amp; câu chuyện.</p><p>Dòng thứ hai.</p>",
      ),
    ).toBe("Một bộ phim & câu chuyện.\nDòng thứ hai.");
  });

  it("removes script and style blocks with their contents", () => {
    expect(
      sanitizeMovieContent(
        '<p>An toàn</p><script>alert("xss")</script><style>body{display:none}</style>',
      ),
    ).toBe("An toàn");
  });

  it("decodes numeric entities and handles empty content", () => {
    expect(sanitizeMovieContent("Phim &#273;i&#7879;n &#7843;nh")).toBe(
      "Phim điện ảnh",
    );
    expect(sanitizeMovieContent()).toBe("");
  });

  it("ignores numeric entities outside the Unicode range", () => {
    expect(sanitizeMovieContent("An toàn &#99999999;")).toBe("An toàn");
  });
});
