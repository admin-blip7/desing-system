/**
 * API Route: Discover AI Models
 *
 * Endpoint para descubrir modelos de IA disponibles por proveedor.
 * Soporta discovery dinámico para OpenAI, Anthropic y Groq.
 */

import { NextRequest, NextResponse } from "next/server";
import { discoverModels, discoverAllModels } from "@/lib/ai/model-discovery";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/ai/discover-models
 *
 * Descubre modelos de un proveedor específico o todos los configurados.
 *
 * Body:
 * - provider: "openai" | "anthropic" | "groq" | "all"
 * - apiKey: string (opcional, se puede obtener de configuración)
 * - useCache: boolean (default: true)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { provider = "all", apiKey, useCache = true } = body;

    // Si el provider es "all", intentar descubrir todos
    if (provider === "all") {
      // Obtener API keys de las variables de entorno o del body
      const configs: Record<string, string> = {
        openai: apiKey?.openai || process.env.OPENAI_API_KEY || "",
        anthropic: apiKey?.anthropic || process.env.ANTHROPIC_API_KEY || "",
        groq: apiKey?.groq || process.env.GROQ_API_KEY || "",
      };

      // Filtrar providers sin API key
      const validConfigs = Object.fromEntries(
        Object.entries(configs).filter(([, key]) => key && key.length > 0)
      );

      if (Object.keys(validConfigs).length === 0) {
        return NextResponse.json(
          {
            error: "No API keys configured",
            message: "Configure at least one AI provider API key",
          },
          { status: 400 }
        );
      }

      const result = await discoverAllModels(validConfigs, { useCache });

      return NextResponse.json(
        {
          providers: result.results,
          errors: result.errors,
          timestamp: new Date().toISOString(),
        }
      );
    }

    // Discovery de un solo provider
    const providerKey =
      apiKey || process.env[`${provider.toUpperCase()}_API_KEY`];

    if (!providerKey) {
      return NextResponse.json(
        {
          error: "Missing API key",
          message: `No API key found for provider: ${provider}`,
        },
        { status: 400 }
      );
    }

    const result = await discoverModels(
      provider as "openai" | "anthropic" | "groq",
      providerKey,
      { useCache }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Error in /api/ai/discover-models:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler para CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

/**
 * GET /api/ai/discover-models
 *
 * Retorna los modelos estáticos disponibles (sin hacer discovery real).
 */
export async function GET() {
  const { STATIC_MODELS } = await import("@/lib/ai/model-discovery/types");

  return NextResponse.json({
    models: STATIC_MODELS,
    source: "static",
    timestamp: new Date().toISOString(),
  });
}
