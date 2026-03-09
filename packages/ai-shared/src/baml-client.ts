import { b } from "./baml_client/baml_client";

export interface RunBamlRequest {
  prompt: string;
  systemPrompt?: string;
  forceJson?: boolean;
  timeoutMs?: number;
  client?: "CustomGPT5Mini" | "CustomGPT5" | "OpenaiFallback";
}

export interface RunBamlResponse {
  content: string;
}

export async function runBaml(request: RunBamlRequest): Promise<RunBamlResponse> {
  const client = request.client || "OpenaiFallback";
  const content = await b.GenerateText(
    request.prompt,
    request.systemPrompt || "",
    Boolean(request.forceJson),
    {
      client,
    },
  );

  return {
    content: String(content || "").trim(),
  };
}
