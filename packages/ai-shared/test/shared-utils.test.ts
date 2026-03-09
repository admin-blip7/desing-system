import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryRateLimiter, sanitizeBrandBriefInput, withRetry } from "../src/index";

test("sanitizeBrandBriefInput strips HTML and control characters", () => {
  const sanitized = sanitizeBrandBriefInput({
    brandName: "<b>Nova\u0000 Labs</b>",
    industry: "Tech",
    description: "<script>alert(1)</script>Building good products",
    audience: "SMBs",
    goals: ["Grow", "  Improve\nretention  "],
    personality: ["Bold"],
  });

  assert.equal(sanitized.brandName, "Nova Labs");
  assert.equal(sanitized.description, "alert(1) Building good products");
  assert.deepEqual(sanitized.goals, ["Grow", "Improve retention"]);
});

test("withRetry retries failing task and returns retry count", async () => {
  let attempts = 0;

  const result = await withRetry(
    async () => {
      attempts += 1;
      if (attempts < 3) {
        throw new Error("transient");
      }
      return "ok";
    },
    {
      maxAttempts: 4,
      initialDelayMs: 1,
      backoffMultiplier: 2,
      maxDelayMs: 10,
    }
  );

  assert.equal(result.value, "ok");
  assert.equal(result.retries, 2);
});

test("rate limiter blocks after limit is reached", () => {
  const limiter = new InMemoryRateLimiter();
  const key = "user:1";

  const first = limiter.check(key, 2, 10_000);
  const second = limiter.check(key, 2, 10_000);
  const third = limiter.check(key, 2, 10_000);

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(third.allowed, false);
  assert.equal(third.remaining, 0);
});
