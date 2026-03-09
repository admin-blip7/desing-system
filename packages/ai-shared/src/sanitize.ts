import type { BrandBriefInput } from "./types";

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const HTML_TAGS = /<[^>]*>/g;
const MULTI_SPACE = /\s{2,}/g;

export function sanitizeString(value: string): string {
  return value
    .replace(CONTROL_CHARS, " ")
    .replace(HTML_TAGS, " ")
    .replace(MULTI_SPACE, " ")
    .trim();
}

function sanitizeStringArray(values: string[] | undefined): string[] | undefined {
  if (!values) return undefined;

  return values
    .map((item) => sanitizeString(item))
    .filter((item) => item.length > 0);
}

export function sanitizeBrandBriefInput(input: BrandBriefInput): BrandBriefInput {
  return {
    ...input,
    brandName: sanitizeString(input.brandName),
    industry: sanitizeString(input.industry),
    description: sanitizeString(input.description),
    audience: sanitizeString(input.audience),
    goals: sanitizeStringArray(input.goals) ?? [],
    personality: sanitizeStringArray(input.personality) ?? [],
    competitors: sanitizeStringArray(input.competitors),
    constraints: sanitizeStringArray(input.constraints),
    locale: input.locale ? sanitizeString(input.locale) : undefined,
  };
}

export function sanitizeRecord<T extends Record<string, unknown>>(record: T): T {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, sanitizeString(value)];
      }

      if (Array.isArray(value)) {
        return [
          key,
          value.map((item) => (typeof item === "string" ? sanitizeString(item) : item)),
        ];
      }

      if (value && typeof value === "object") {
        return [key, sanitizeRecord(value as Record<string, unknown>)];
      }

      return [key, value];
    })
  ) as T;
}
