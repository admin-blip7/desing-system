"use client";

/**
 * AI Generate Button - Versión Mejorada
 * 
 * Botón inteligente con:
 * - Integración con lucide-react
 * - Soporte para selección de modelo dinámico
 * - Cost estimation real basado en modelo
 * - Estados de generación visuales
 * - Integración con sistema BAML
 */

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Bot,
  Coins,
  RefreshCw,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelOption, estimateGenerationCost } from "@/lib/ai/model-discovery";

export interface AIGenerateButtonProps {
  brandId: string;
  moduleKey: string;
  moduleName?: string;
  phaseId?: number;
  selectedModel?: ModelOption;
  estimatedTokens?: number;
  dependencies?: {
    moduleKey: string;
    content: unknown;
  }[];
  disabled?: boolean;
  disabledReason?: string;
  userAnswers?: Record<string, string | string[]>; // NUEVO: respuestas del usuario
  onGenerationComplete?: (content: unknown) => void;
  onGenerationError?: (error: string) => void;
  onGenerationStart?: () => void;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showCostEstimate?: boolean;
  showModelBadge?: boolean;
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

type GenerationState = "idle" | "validating" | "generating" | "completed" | "error";
type StreamStatus = "idle" | "connecting" | "generating" | "completed" | "error";

export function AIGenerateButton({
  brandId,
  moduleKey,
  moduleName,
  phaseId,
  selectedModel,
  estimatedTokens = 1500,
  dependencies = [],
  disabled = false,
  disabledReason,
  onGenerationComplete,
  onGenerationError,
  onGenerationStart,
  variant = "default",
  size = "default",
  showCostEstimate = true,
  showModelBadge = true,
  className,
  children,
  fullWidth = false,
  userAnswers = {}, // NUEVA PROP
}: AIGenerateButtonProps) {
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Calcular costo estimado basado en el modelo seleccionado
  const costEstimate = useMemo(() => {
    if (!selectedModel) return { inputCost: 0, outputCost: 0, totalCost: 0 };
    return estimateGenerationCost(selectedModel, estimatedTokens);
  }, [selectedModel, estimatedTokens]);

  const isDisabled = disabled || generationState === "generating" || generationState === "validating";

  // ============================================
  // GENERATION HANDLER
  // ============================================

  const handleGenerate = useCallback(async () => {
    if (isDisabled) return;

    setGenerationState("validating");
    setErrorMessage("");
    setProgress(0);
    setElapsedTime(0);
    onGenerationStart?.();

    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      // 1. Validar dependencias
      const validation = await validateDependencies();

      if (!validation.valid) {
        clearInterval(timerInterval);
        setErrorMessage(validation.error || "Faltan dependencias requeridas");
        setGenerationState("error");
        onGenerationError?.(validation.error || "Validation failed");
        return;
      }

      // 2. Iniciar generación
      setGenerationState("generating");
      setStreamStatus("connecting");

      // Preparar el payload con userAnswers si existe
      const requestBody: Record<string, unknown> = {
        brandId,
        moduleKey,
        stream: true,
        modelConfig: selectedModel ? {
          provider: selectedModel.provider,
          model: selectedModel.id,
        } : undefined,
      };

      // Agregar userAnswers si existen
      if (userAnswers && Object.keys(userAnswers).length > 0) {
        requestBody.userAnswers = userAnswers;
      }

      // 3. Llamar API de generación con modelo seleccionado
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // 4. Streaming de generación
      await streamGeneration(response, {
        onUpdate: (update) => {
          setProgress(update.progress || 0);
          setStreamStatus(update.status);
        },
        onComplete: (result) => {
          clearInterval(timerInterval);
          setGenerationState("completed");
          setProgress(100);
          setStreamStatus("completed");

          if (result.content) {
            onGenerationComplete?.(result.content);
          }
        },
        onError: (error) => {
          clearInterval(timerInterval);
          setErrorMessage(error);
          setGenerationState("error");
          setStreamStatus("error");
          onGenerationError?.(error);
        },
      });
    } catch (error) {
      clearInterval(timerInterval);
      const errorMsg = error instanceof Error ? error.message : "Error al generar módulo";
      setErrorMessage(errorMsg);
      setGenerationState("error");
      setStreamStatus("error");
      onGenerationError?.(errorMsg);
    }
  }, [
    isDisabled,
    moduleKey,
    brandId,
    selectedModel,
    userAnswers,
    onGenerationComplete,
    onGenerationError,
    onGenerationStart,
  ]);

  // ============================================
  // VALIDATION
  // ============================================

  const validateDependencies = useCallback(async (): Promise<{
    valid: boolean;
    error?: string;
  }> => {
    if (dependencies.length === 0) return { valid: true };

    // Verificar que todas las dependencias tengan contenido
    const missingDeps = dependencies.filter((dep) => !dep.content);
    if (missingDeps.length > 0) {
      return {
        valid: false,
        error: `Faltan módulos requeridos: ${missingDeps.map((d) => d.moduleKey).join(", ")}`,
      };
    }

    return { valid: true };
  }, [dependencies]);

  // ============================================
  // STREAMING
  // ============================================

  const streamGeneration = async (
    response: Response,
    options: {
      onUpdate: (update: { progress?: number; status: StreamStatus; content?: string }) => void;
      onComplete: (result: { content?: unknown }) => void;
      onError: (error: string) => void;
    }
  ) => {
    try {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              options.onUpdate({ status: "completed", progress: 100 });
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "error") {
                options.onError(parsed.error || "Error en generación");
                return;
              }

              if (parsed.type === "status") {
                options.onUpdate({
                  status: "generating",
                  progress: parsed.step === "context" ? 20 : 60,
                });
                continue;
              }

              if (parsed.type === "result" && parsed.success) {
                options.onUpdate({ status: "completed", progress: 100 });
                options.onComplete({ content: parsed.data });
                return;
              }
            } catch {
              // Ignorar errores de parse
            }
          }
        }
      }
      options.onError("La generación terminó sin devolver resultado.");
    } catch (error) {
      options.onError(error instanceof Error ? error.message : "Streaming error");
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const getButtonIcon = () => {
    switch (generationState) {
      case "idle":
        return <Sparkles className="h-4 w-4" />;
      case "validating":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "generating":
        return <Bot className="h-4 w-4 animate-pulse" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "error":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getButtonText = () => {
    if (children) return children;

    switch (generationState) {
      case "idle":
        return "Generar con IA";
      case "validating":
        return "Validando...";
      case "generating":
        return progress > 0 ? `Generando ${progress}%` : "Generando...";
      case "completed":
        return "¡Completado!";
      case "error":
        return "Reintentar";
      default:
        return "Generar con IA";
    }
  };

  const getButtonVariant = () => {
    switch (generationState) {
      case "error":
        return "destructive";
      case "completed":
        return "default";
      default:
        return variant;
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        onClick={handleGenerate}
        disabled={isDisabled}
        variant={getButtonVariant()}
        size={size}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          fullWidth && "w-full",
          generationState === "generating" && "animate-pulse",
          generationState === "completed" && "bg-green-600 hover:bg-green-700",
          generationState === "error" && "bg-red-600 hover:bg-red-700"
        )}
      >
        <span className="relative z-10 flex items-center gap-2">
          {getButtonIcon()}
          {getButtonText()}
          {generationState === "generating" && elapsedTime > 0 && (
            <span className="text-xs opacity-70">({elapsedTime}s)</span>
          )}
        </span>

        {/* Progress bar overlay */}
        {generationState === "generating" && (
          <div
            className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}
      </Button>

      {/* Model badge */}
      {showModelBadge && selectedModel && generationState === "idle" && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wand2 className="h-3 w-3" />
          <span>{selectedModel.name}</span>
          {selectedModel.isRecommended && (
            <span className="text-green-600 font-medium">(Recomendado)</span>
          )}
        </div>
      )}

      {/* Cost estimate */}
      {showCostEstimate && generationState === "idle" && costEstimate.totalCost > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Coins className="h-3 w-3" />
          <span>~${costEstimate.totalCost.toFixed(4)} USD</span>
        </div>
      )}

      {/* Disabled reason */}
      {disabled && disabledReason && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {disabledReason}
        </p>
      )}

      {/* Error message */}
      {generationState === "error" && errorMessage && (
        <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// ============================================
// MINIMAL VARIANT (for tight spaces)
// ============================================

interface AIGenerateButtonMinimalProps extends Omit<AIGenerateButtonProps, "size"> {
  iconOnly?: boolean;
}

export function AIGenerateButtonMinimal({
  iconOnly = false,
  ...props
}: AIGenerateButtonMinimalProps) {
  const [generationState, setGenerationState] = useState<GenerationState>("idle");

  const getIcon = () => {
    switch (generationState) {
      case "idle":
        return <Sparkles className="h-4 w-4" />;
      case "generating":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  if (iconOnly) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="shrink-0"
        disabled={props.disabled}
        onClick={() => {
          // El botón completo se renderiza en el tooltip/popover
        }}
      >
        {getIcon()}
      </Button>
    );
  }

  return (
    <AIGenerateButton
      {...props}
      size="sm"
      variant="outline"
      showCostEstimate={false}
      showModelBadge={false}
      onGenerationComplete={(content) => {
        setGenerationState("completed");
        props.onGenerationComplete?.(content);
      }}
      onGenerationError={(error) => {
        setGenerationState("error");
        props.onGenerationError?.(error);
      }}
      onGenerationStart={() => {
        setGenerationState("generating");
        props.onGenerationStart?.();
      }}
    />
  );
}

// ============================================
// STATS DISPLAY
// ============================================

interface GenerationStatsProps {
  moduleKey: string;
  phaseId?: number;
  selectedModel?: ModelOption;
  estimatedTokens?: number;
  showDetails?: boolean;
}

export function GenerationStats({
  moduleKey,
  phaseId,
  selectedModel,
  estimatedTokens = 1500,
  showDetails = false,
}: GenerationStatsProps) {
  const estimate = useMemo(() => {
    if (!selectedModel) return { tokens: estimatedTokens, cost: 0.01 };
    const cost = estimateGenerationCost(selectedModel, estimatedTokens);
    return { tokens: estimatedTokens, cost: cost.totalCost };
  }, [selectedModel, estimatedTokens]);

  if (!showDetails) {
    return (
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Coins className="h-3 w-3" />
        ~${estimate.cost.toFixed(4)} USD
      </span>
    );
  }

  return (
    <div className="text-xs space-y-1 bg-muted p-3 rounded-md">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tokens estimados:</span>
        <span className="font-mono">{estimate.tokens.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Costo estimado:</span>
        <span className="font-mono font-bold text-primary">
          ${estimate.cost.toFixed(4)} USD
        </span>
      </div>
      {selectedModel && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Modelo:</span>
          <span className="font-medium">{selectedModel.name}</span>
        </div>
      )}
    </div>
  );
}
