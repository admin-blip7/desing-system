import { z } from "zod";
import { ConfigurationError } from "./errors";

const envSchema = z.object({
  AI_PROVIDER: z.enum(["mock", "baml", "openai"]).default("mock"),
  OPENAI_API_KEY: z.string().trim().optional(),
  OPENAI_BASE_URL: z.string().trim().url().default("https://api.openai.com/v1"),
  BRAND_FLOW_REGISTRY_FILE: z.string().trim().default(".tmp/prompt-registry.json"),
  BRAND_FLOW_BRANDS_FILE: z.string().trim().default("config/brands.default.json"),
});

export type BrandFlowEnv = z.infer<typeof envSchema>;

export function loadBrandFlowEnv(source: NodeJS.ProcessEnv = process.env): BrandFlowEnv {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    throw new ConfigurationError("Invalid environment configuration", {
      issues: parsed.error.flatten(),
    });
  }

  const env = parsed.data;

  if ((env.AI_PROVIDER === "openai" || env.AI_PROVIDER === "baml") && !env.OPENAI_API_KEY) {
    throw new ConfigurationError("OPENAI_API_KEY is required when AI_PROVIDER=openai|baml");
  }

  return env;
}
