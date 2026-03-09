import type { ZodType } from "zod";
import { ValidationError } from "./errors";

function stripCodeFence(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    const withoutFence = trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "");
    return withoutFence.trim();
  }

  return trimmed;
}

export function parseJsonOutput(raw: string): unknown {
  const sanitized = stripCodeFence(raw);

  try {
    return JSON.parse(sanitized);
  } catch {
    throw new ValidationError("Model output is not valid JSON", {
      raw,
    });
  }
}

export function validateOutput<T>(schema: ZodType<T>, raw: string): T {
  const parsed = parseJsonOutput(raw);
  const result = schema.safeParse(parsed);

  if (!result.success) {
    throw new ValidationError("Model output does not satisfy schema", {
      issues: result.error.flatten(),
      parsed,
    });
  }

  return result.data;
}
