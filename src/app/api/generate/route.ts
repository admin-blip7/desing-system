import { NextRequest } from "next/server";
import { generateModuleAction } from "@/actions/generate-module";
import { buildModuleContext } from "@/lib/ai/context-builder";
import { createClient } from "@/lib/supabase/server";
import { consumeGenerationQuota } from "@/lib/ai/rate-limiter";
import { getErrorMessage, sanitizeErrorMessage } from "@/lib/ai/error-handler";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { brandId, moduleKey, userAnswers, modelConfig, mode } = body as {
    brandId?: string;
    moduleKey?: string;
    userAnswers?: Record<string, string | string[]>;
    modelConfig?: { provider: string; model: string };
    mode?: "questions" | "auto";
  };

  if (!brandId || !moduleKey) {
    return new Response(JSON.stringify({
      success: false,
      error: "brandId and moduleKey are required"
    }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: "Unauthorized"
    }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const quota = consumeGenerationQuota(user.id);
  if (!quota.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Rate limit exceeded. Max 10 generation requests per hour.",
        resetAt: quota.resetAt,
      }),
      {
        status: 429,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        send({
          type: "meta",
          remaining: quota.remaining,
          resetAt: quota.resetAt,
        });

        send({ type: "status", step: "context", message: "Building context" });

        const contextResult = await buildModuleContext(brandId, moduleKey, userAnswers);

        if (!contextResult.success) {
          send({ type: "error", error: contextResult.error || "Context failed" });
          controller.close();
          return;
        }

        send({
          type: "context",
          moduleName: contextResult.data?.moduleName,
          dependencies: Object.keys(contextResult.data?.dependencyOutputs || {}).length,
        });

        send({ type: "status", step: "generation", message: "Generating content" });

        const result = await generateModuleAction(
          brandId,
          contextResult.data?.moduleKey || moduleKey,
          userAnswers,
          { modelConfig, mode }
        );

        if (!result.success) {
          send({ type: "error", error: result.error || "Generation failed" });
          controller.close();
          return;
        }

        send({ type: "result", success: true, data: result.data });
      } catch (error) {
        const message = sanitizeErrorMessage(getErrorMessage(error));
        send({ type: "error", error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "connection": "keep-alive",
    },
  });
}
