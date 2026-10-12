export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * tmdb-ts rejects with TMDB's JSON error body rather than an Error. Normalise
 * that into an HttpError so route handlers can return a sensible status.
 */
export function fromTmdbError(error: unknown): unknown {
  if (error instanceof Error || typeof error !== "object" || error === null) {
    return error;
  }
  const { status_code, status_message } = error as {
    status_code?: number;
    status_message?: string;
  };
  // 6 = invalid id, 34 = resource not found.
  if (status_code === 6 || status_code === 34) {
    return new HttpError(404, "Not found");
  }
  return new HttpError(502, `TMDB error: ${status_message ?? "unknown"}`);
}

export async function tmdbCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw fromTmdbError(error);
  }
}
