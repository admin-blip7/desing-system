import { runBaml } from "@bm/ai-shared";

export interface BamlRunRequest {
  prompt: string;
  systemPrompt?: string;
  forceJson?: boolean;
  inputs?: Record<string, unknown>;
}

export interface BamlRunResponse {
  content: string;
}

function appendInputsToPrompt(prompt: string, inputs?: Record<string, unknown>): string {
  if (!inputs || Object.keys(inputs).length === 0) {
    return prompt;
  }

  return `${prompt}\n\nContexto adicional:\n${JSON.stringify(inputs, null, 2)}`;
}

export async function runBamlText(request: BamlRunRequest): Promise<BamlRunResponse> {
  const content = await runBaml({
    prompt: appendInputsToPrompt(request.prompt, request.inputs),
    systemPrompt: request.systemPrompt,
    forceJson: request.forceJson,
  });

  return content;
}
