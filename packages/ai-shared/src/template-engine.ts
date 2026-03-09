import type {
  BrandContext,
  PromptRenderResult,
  PromptTemplateVersionRecord,
} from "./types";
import { PromptRenderError } from "./errors";

function resolvePath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

function toStringValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function renderPlaceholders(
  template: string,
  variables: Record<string, unknown>
): string {
  return template.replace(/{{\s*([a-zA-Z0-9_.-]+)\s*}}/g, (_match, rawPath: string) => {
    const value = resolvePath(variables, rawPath);

    if (value === undefined) {
      throw new PromptRenderError(`Missing template variable: ${rawPath}`, {
        missingVariable: rawPath,
      });
    }

    return toStringValue(value);
  });
}

function buildFewShotBlock(fewShotExamples: PromptTemplateVersionRecord["fewShotExamples"]): string {
  if (!fewShotExamples.length) {
    return "";
  }

  const lines = fewShotExamples.flatMap((example, index) => {
    const linePrefix = `Example ${index + 1}`;
    return [
      `${linePrefix} Input:`,
      example.input,
      `${linePrefix} Output:`,
      example.output,
      example.rationale ? `${linePrefix} Rationale:\n${example.rationale}` : "",
    ].filter(Boolean);
  });

  return `\n\nFew-shot examples:\n${lines.join("\n")}`;
}

export function renderPromptTemplate(params: {
  template: PromptTemplateVersionRecord;
  brandContext: BrandContext;
  input: Record<string, unknown>;
  dependencies?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}): PromptRenderResult {
  const { template, brandContext, input, dependencies = {}, metadata = {} } = params;

  const variables: Record<string, unknown> = {
    brand: brandContext,
    input,
    dependencies,
    metadata,
  };

  const renderedSystem = renderPlaceholders(template.systemTemplate, variables);
  const renderedInstruction = renderPlaceholders(template.instructionTemplate, variables);
  const fewShotBlock = buildFewShotBlock(template.fewShotExamples);

  const userPrompt = `${renderedInstruction}${fewShotBlock}${
    template.outputFormatHint ? `\n\nOutput format:\n${template.outputFormatHint}` : ""
  }`;

  return {
    systemPrompt: renderedSystem,
    userPrompt,
    variables,
    usedTemplate: template,
  };
}
