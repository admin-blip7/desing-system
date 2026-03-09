import type { ZodType } from "zod";
import { ValidationError } from "./errors";

export function validateOrThrow<T>(schema: ZodType<T>, value: unknown, message: string): T {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    throw new ValidationError(message, {
      issues: parsed.error.flatten(),
    });
  }

  return parsed.data;
}
