type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10;

export function consumeGenerationQuota(actorId: string) {
  const now = Date.now();
  const existing = buckets.get(actorId);

  if (!existing || now >= existing.resetAt) {
    const nextBucket: Bucket = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };
    buckets.set(actorId, nextBucket);
    return {
      allowed: true,
      remaining: MAX_REQUESTS - nextBucket.count,
      resetAt: nextBucket.resetAt,
    };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  buckets.set(actorId, existing);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - existing.count,
    resetAt: existing.resetAt,
  };
}
