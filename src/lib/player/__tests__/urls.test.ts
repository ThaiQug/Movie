import { describe, expect, it } from "vitest";
import { sanitizePlaybackUrl } from "../urls";

const allowedHosts = new Set(["video.example.com"]);

describe("sanitizePlaybackUrl", () => {
  it("accepts an HTTPS URL from an exact allowlisted hostname", () => {
    expect(
      sanitizePlaybackUrl(
        "https://video.example.com/master.m3u8?token=abc",
        allowedHosts,
      ),
    ).toBe("https://video.example.com/master.m3u8?token=abc");
  });

  it.each([
    "http://video.example.com/master.m3u8",
    "https://video.example.com.evil.test/master.m3u8",
    "https://user:password@video.example.com/master.m3u8",
    "https://video.example.com:8443/master.m3u8",
    "not-a-url",
  ])("rejects an unsafe URL: %s", (url) => {
    expect(sanitizePlaybackUrl(url, allowedHosts)).toBeUndefined();
  });

  it("accepts the explicit HTTPS default port", () => {
    expect(
      sanitizePlaybackUrl(
        "https://video.example.com:443/master.m3u8",
        allowedHosts,
      ),
    ).toBe("https://video.example.com/master.m3u8");
  });
});
