import type {
  AICompletionRequest,
  AICompletionResponse,
  AiProvider,
} from "./types";
import type { BrandFlowEnv } from "./env";
import { ProviderError } from "./errors";
import { runBaml } from "./baml-client";

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new ProviderError(message, { timeoutMs }, true));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function extractOpenAiOutput(payload: Record<string, unknown>): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim().length > 0) {
    return payload.output_text;
  }

  const output = payload.output;
  if (!Array.isArray(output)) {
    throw new ProviderError("OpenAI response does not include textual output", {
      hasOutputText: typeof payload.output_text === "string",
    }, false);
  }

  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const message = item as Record<string, unknown>;
    const content = message.content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const block of content) {
      if (!block || typeof block !== "object") {
        continue;
      }

      const record = block as Record<string, unknown>;
      if (typeof record.text === "string" && record.text.trim().length > 0) {
        return record.text;
      }
    }
  }

  throw new ProviderError("OpenAI response output is empty", {}, false);
}

export class MockAiProvider implements AiProvider {
  readonly name = "mock";

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const started = Date.now();
    const maybeResponse = request.metadata?.mockResponse;

    const content = typeof maybeResponse === "string" ? maybeResponse : JSON.stringify({
      message: "mock_response",
      module: request.metadata?.moduleId,
    });

    return {
      content,
      model: request.model,
      latencyMs: Date.now() - started,
      usage: {
        inputTokens: estimateTokens(request.systemPrompt + request.userPrompt),
        outputTokens: estimateTokens(content),
      },
      raw: {
        provider: "mock",
      },
    };
  }
}

export class BamlProvider implements AiProvider {
  readonly name = "baml";

  constructor(private readonly env: BrandFlowEnv) {}

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!this.env.OPENAI_API_KEY) {
      throw new ProviderError("OPENAI_API_KEY is required for BAML provider", {
        provider: this.name,
      }, false);
    }

    const started = Date.now();
    const result = await withTimeout(
      runBaml({
        prompt: request.userPrompt,
        systemPrompt: request.systemPrompt,
      }),
      request.timeoutMs || 60_000,
      "BAML request timed out",
    );
    const output = result.content;

    return {
      content: output,
      model: request.model,
      latencyMs: Date.now() - started,
      usage: {
        inputTokens: estimateTokens(request.systemPrompt + request.userPrompt),
        outputTokens: estimateTokens(output),
      },
      raw: { provider: "baml" },
    };
  }
}

export class OpenAIResponsesProvider implements AiProvider {
  readonly name = "openai";

  constructor(private readonly env: BrandFlowEnv) {}

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!this.env.OPENAI_API_KEY) {
      throw new ProviderError("OpenAI API key is not configured", {
        provider: this.name,
      }, false);
    }

    const started = Date.now();
    const url = `${this.env.OPENAI_BASE_URL.replace(/\/$/, "")}/responses`;

    const payload = {
      model: request.model,
      temperature: request.temperature,
      max_output_tokens: request.maxTokens,
      input: [
        {
          role: "system",
          content: request.systemPrompt,
        },
        {
          role: "user",
          content: request.userPrompt,
        },
      ],
    };

    const response = await withTimeout(
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
      }),
      request.timeoutMs || 60_000,
      "OpenAI request timed out"
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new ProviderError("OpenAI request failed", {
        status: response.status,
        body,
      });
    }

    const json = (await response.json()) as Record<string, unknown>;
    const content = extractOpenAiOutput(json);
    const usage =
      json.usage && typeof json.usage === "object"
        ? (json.usage as Record<string, unknown>)
        : {};

    const inputTokens =
      typeof usage.input_tokens === "number"
        ? usage.input_tokens
        : estimateTokens(request.systemPrompt + request.userPrompt);
    const outputTokens =
      typeof usage.output_tokens === "number"
        ? usage.output_tokens
        : estimateTokens(content);

    return {
      content,
      model: typeof json.model === "string" ? json.model : request.model,
      latencyMs: Date.now() - started,
      usage: {
        inputTokens,
        outputTokens,
      },
      raw: json,
    };
  }
}

export function createAiProvider(env: BrandFlowEnv): AiProvider {
  if (env.AI_PROVIDER === "baml") {
    return new BamlProvider(env);
  }

  if (env.AI_PROVIDER === "openai") {
    return new OpenAIResponsesProvider(env);
  }

  return new MockAiProvider();
}
