import { z } from "zod";
import {
  InvalidOPhimResponseError,
  MovieNotFoundError,
  OPhimApiError,
} from "./errors";

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [250, 500] as const;

interface RequestOptions {
  revalidate: number;
  movieSlug?: string;
}

function getBaseUrl(): string {
  return process.env.OPHIM_BASE_URL?.trim() || "https://ophim1.com";
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isRetryableStatus(status: number): boolean {
  return status >= 500 && status <= 599;
}

export async function fetchOPhim<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions,
): Promise<T> {
  const url = new URL(path, getBaseUrl());
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Cinematic/0.1",
        },
        signal: controller.signal,
        next: {
          revalidate: options.revalidate,
        },
      });

      if (response.status === 404 && options.movieSlug) {
        throw new MovieNotFoundError(options.movieSlug);
      }

      if (!response.ok) {
        const error = new OPhimApiError(
          `OPhim request failed with status ${response.status}.`,
          { status: response.status },
        );

        if (!isRetryableStatus(response.status)) {
          throw error;
        }

        lastError = error;
      } else {
        let result: unknown;

        try {
          result = await response.json();
        } catch (error) {
          throw new InvalidOPhimResponseError(
            `OPhim returned invalid JSON for ${url.pathname}.`,
            { cause: error },
          );
        }

        const parsed = schema.safeParse(result);

        if (!parsed.success) {
          throw new InvalidOPhimResponseError(
            `Invalid OPhim response for ${url.pathname}.`,
          );
        }

        return parsed.data;
      }
    } catch (error) {
      if (
        error instanceof InvalidOPhimResponseError ||
        error instanceof MovieNotFoundError ||
        (error instanceof OPhimApiError &&
          error.status !== undefined &&
          !isRetryableStatus(error.status))
      ) {
        throw error;
      }

      lastError = error;
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < MAX_RETRIES) {
      await delay(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw new OPhimApiError("OPhim is temporarily unavailable.", {
    cause: lastError,
  });
}
