import { describe, expect, it } from "vitest";
import type { MovieServer } from "@/lib/ophim";
import {
  buildPlayerHref,
  isCanonicalPlayerQuery,
  resolvePlayerSelection,
} from "../selection";

const allowlists = {
  video: new Set(["video.example.com"]),
  embed: new Set(["embed.example.com"]),
};

const servers: MovieServer[] = [
  {
    name: "Server lỗi",
    isAi: false,
    episodes: [
      {
        name: "Tập lỗi",
        slug: "tap-loi",
        m3u8Url: "http://video.example.com/invalid.m3u8",
      },
    ],
  },
  {
    name: "Vietsub",
    isAi: false,
    episodes: [
      {
        name: "Tập 1",
        slug: "tap-1",
        m3u8Url: "https://video.example.com/tap-1.m3u8",
        embedUrl: "https://embed.example.com/tap-1",
      },
      {
        name: "Tập 2",
        slug: "tap-2",
        embedUrl: "https://embed.example.com/tap-2",
      },
    ],
  },
  {
    name: "Thuyết minh",
    isAi: false,
    episodes: [
      {
        name: "Tập 1",
        slug: "tap-1",
        m3u8Url: "https://video.example.com/thuyet-minh.m3u8",
      },
    ],
  },
];

describe("resolvePlayerSelection", () => {
  it("falls back to the first server and episode with a safe source", () => {
    const result = resolvePlayerSelection(servers, {}, allowlists);

    expect(result?.server.index).toBe(1);
    expect(result?.episode.slug).toBe("tap-1");
    expect(result?.servers.map(({ index }) => index)).toEqual([1, 2]);
  });

  it("keeps a valid server and episode from the query", () => {
    const result = resolvePlayerSelection(
      servers,
      { server: "1", episode: "tap-2" },
      allowlists,
    );

    expect(result?.server.name).toBe("Vietsub");
    expect(result?.episode).toMatchObject({
      slug: "tap-2",
      m3u8Url: undefined,
      embedUrl: "https://embed.example.com/tap-2",
    });
  });

  it("falls back within a valid server when the episode is invalid", () => {
    const result = resolvePlayerSelection(
      servers,
      { server: "2", episode: "khong-ton-tai" },
      allowlists,
    );

    expect(result?.server.index).toBe(2);
    expect(result?.episode.slug).toBe("tap-1");
  });

  it("returns null when every upstream source is unsafe", () => {
    expect(
      resolvePlayerSelection([servers[0]], {}, allowlists),
    ).toBeNull();
  });
});

describe("player query helpers", () => {
  it("only accepts a scalar query matching the resolved selection", () => {
    const selection = resolvePlayerSelection(
      servers,
      { server: "1", episode: "tap-1" },
      allowlists,
    );

    expect(selection).not.toBeNull();
    expect(
      isCanonicalPlayerQuery(
        { server: "1", episode: "tap-1" },
        selection!,
      ),
    ).toBe(true);
    expect(
      isCanonicalPlayerQuery(
        { server: ["1"], episode: "tap-1" },
        selection!,
      ),
    ).toBe(false);
  });

  it("builds an encoded canonical watch URL", () => {
    expect(buildPlayerHref("phim hay", 2, "tập 1")).toBe(
      "/xem-phim/phim%20hay?server=2&episode=t%E1%BA%ADp+1",
    );
  });
});
