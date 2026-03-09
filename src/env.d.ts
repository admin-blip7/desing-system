/// <reference types="node" />

interface ProcessEnv {
  // Brand y módulos
  brandId?: string;
  moduleKey?: string;
  userAnswers?: Record<string, string | string[]>;
  stream?: boolean | "true";

  // OpenAI
  OPENAI_TEXT_MODEL?: string;
  AI_PROVIDER?: string;

  // Database
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;

  // Rate limiting
  QUOTA_LIMIT?: string;
  BRAND_GUARDRAIL_MODE?: string;
}

