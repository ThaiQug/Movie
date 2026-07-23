import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { fetchOPhim } from "../client";
import {
  InvalidOPhimResponseError,
  MovieNotFoundError,
  OPhimApiError,
} from "../errors";

const responseSchema = z.object({
  status: z.literal("success"),
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchOPhim", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("validates a successful response and forwards cache options", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(jsonResponse({ status: "success" }));

    await expect(
      fetchOPhim("/v1/api/home", responseSchema, { revalidate: 300 }),
    ).resolves.toEqual({ status: "success" });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("https://ophim1.com/v1/api/home"),
      expect.objectContaining({
        next: { revalidate: 300 },
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("retries retryable 5xx responses and then succeeds", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse({}, 503))
      .mockResolvedValueOnce(jsonResponse({}, 502))
      .mockResolvedValueOnce(jsonResponse({ status: "success" }));

    const request = fetchOPhim("/v1/api/home", responseSchema, {
      revalidate: 300,
    });
    const assertion = expect(request).resolves.toEqual({ status: "success" });

    await vi.runAllTimersAsync();
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not retry a non-retryable 4xx response", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(jsonResponse({}, 400));

    await expect(
      fetchOPhim("/v1/api/home", responseSchema, { revalidate: 300 }),
    ).rejects.toMatchObject({
      name: "OPhimApiError",
      status: 400,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("maps a movie 404 to MovieNotFoundError without retrying", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(jsonResponse({}, 404));

    await expect(
      fetchOPhim("/v1/api/phim/khong-ton-tai", responseSchema, {
        revalidate: 120,
        movieSlug: "khong-ton-tai",
      }),
    ).rejects.toBeInstanceOf(MovieNotFoundError);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rejects an invalid payload without retrying", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(jsonResponse({ status: "unexpected" }));

    await expect(
      fetchOPhim("/v1/api/home", responseSchema, { revalidate: 300 }),
    ).rejects.toBeInstanceOf(InvalidOPhimResponseError);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("maps malformed JSON to an invalid response without retrying", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      new Response("{not-json", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      fetchOPhim("/v1/api/home", responseSchema, { revalidate: 300 }),
    ).rejects.toMatchObject({
      name: "InvalidOPhimResponseError",
      cause: expect.any(SyntaxError),
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("stops after the initial request and two network retries", async () => {
    const fetchMock = vi.mocked(fetch);
    const networkError = new TypeError("network unavailable");
    fetchMock.mockRejectedValue(networkError);

    const request = fetchOPhim("/v1/api/home", responseSchema, {
      revalidate: 300,
    });
    const assertion = expect(request).rejects.toMatchObject({
      name: "OPhimApiError",
      cause: networkError,
    });

    await vi.runAllTimersAsync();
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("aborts timed-out attempts and returns a typed error", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation((_input, init) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The operation was aborted.", "AbortError"));
        });
      });
    });

    const request = fetchOPhim("/v1/api/home", responseSchema, {
      revalidate: 300,
    });
    const assertion = expect(request).rejects.toBeInstanceOf(OPhimApiError);

    await vi.runAllTimersAsync();
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(
      fetchMock.mock.calls.every(([, init]) => init?.signal?.aborted === true),
    ).toBe(true);
  });
});
