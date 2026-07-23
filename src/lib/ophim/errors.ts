export class OPhimApiError extends Error {
  readonly status?: number;

  constructor(message: string, options?: { status?: number; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.name = "OPhimApiError";
    this.status = options?.status;
  }
}

export class MovieNotFoundError extends OPhimApiError {
  constructor(slug: string) {
    super(`Movie "${slug}" was not found.`, { status: 404 });
    this.name = "MovieNotFoundError";
  }
}

export class InvalidOPhimResponseError extends OPhimApiError {
  constructor(
    message = "OPhim response does not match the expected format.",
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "InvalidOPhimResponseError";
  }
}
