import { NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const MAX_BUCKETS = 5_000;

function pruneBuckets(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Lightweight in-memory rate limiter.
 * Good enough for single-node / low-traffic Vercel; not a global multi-region store.
 */
export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): { success: true } | { success: false; retryAfterSec: number } {
  const now = Date.now();
  pruneBuckets(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { success: true };
  }

  if (existing.count >= options.limit) {
    return {
      success: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { success: true };
}

/** Read-only check used before recording another failure (e.g. login). */
export function isRateLimited(
  key: string,
  options: { limit: number; windowMs: number },
): { limited: false } | { limited: true; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    return { limited: false };
  }

  if (existing.count >= options.limit) {
    return {
      limited: true,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { limited: false };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function tooManyRequests(retryAfterSec: number) {
  return NextResponse.json(
    {
      success: false,
      message: "Too many requests. Please try again later.",
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}
