"use client";

/**
 * WorkspaceAIGenerator - Componente Universal
 * 
 * Componente reutilizable que proporciona funcionalidad de generación con IA
 * para cualquier módulo del Brand Manual. Incluye:
 * - Formulario de preguntas pre-generation
 * - Botón de generación simple
 * - Barra de progreso/espera durante generación
 */

import React, { useState, useEffect } from "react";
import { 
  Wand2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { AIGenerateButton } from "@/components/ai/generate-button/AIGenerateButton";
import { phases } from "@/lib/data/phases";

export interface WorkspaceAIGeneratorProps {
  moduleKey: string;
  brandId: string;
  phaseId?: number;
  onGenerated?: (data: unknown) => void;
  onError?: (error: string) => void;
  className?: string;
  showContract?: boolean;
  disabled?: boolean;
  externalExpanded?: boolean; // Nuevo: permite controlar expansión desde afuera
}

interface PreQuestion {
  key: string;
  question: string;
  type: "text" | "textarea" | "select" | "multi-select" | "tags" | "file";
  options?: string[];
  example?: string;
  condition?: string;
}

function normalizeMultiValue(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0);
      }
    } catch {
      // fallback to comma split
    }
  }

  return trimmed
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function WorkspaceAIGenerator({
  moduleKey,
  brandId,
  onGenerated,
  onError,
  className,
  disabled = false,
  externalExpanded = false, // Nueva prop
}: WorkspaceAIGeneratorProps) {
  // Estados
  const [isExpanded, setIsExpanded] = useState(externalExpanded);
  const [isGenerating, setIsGenerating] = useState(false);
  const [waitingProgress, setWaitingProgress] = useState(0);

  // Sincronizar expansión cuando cambia externalExpanded
  useEffect(() => {
    setIsExpanded(externalExpanded);
  }, [externalExpanded]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [preQuestions, setPreQuestions] = useState<PreQuestion[]>([]);

  // Cargar definición del módulo
  useEffect(() => {
    const moduleDef = findModuleDefinition(moduleKey);
    if (moduleDef?.preQuestions) {
      // Mapear desde el formato Question (con propiedad 'q') a PreQuestion (con propiedad 'question')
      const mappedQuestions = moduleDef.preQuestions.map((q: Record<string, unknown>) => ({
        key: String(q.key || ""),
        question: String(q.q || q.question || ""), // Soportar ambos formatos
        type: (q.type || "text") as PreQuestion["type"],
        options: Array.isArray(q.options)
          ? (q.options as string[])
          : undefined,
        example: typeof q.example === "string" ? q.example : undefined,
        condition: typeof q.condition === "string" ? q.condition : undefined,
      }));
      setPreQuestions(mappedQuestions as PreQuestion[]);
    }
  }, [moduleKey]);

  // Manejar cambio en respuestas
  const handleAnswerChange = (key: string, value: string | string[]) => {
    setUserAnswers(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setWaitingProgress((prev) => {
        if (prev >= 92) return prev;
        return prev + 4;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerationStart = () => {
    setIsGenerating(true);
    setWaitingProgress(8);
  };

  const handleGenerationComplete = (data: unknown) => {
    setWaitingProgress(100);
    setTimeout(() => {
      setIsGenerating(false);
      setWaitingProgress(0);
    }, 350);
    onGenerated?.(data);
  };

  const handleGenerationError = (error: string) => {
    setIsGenerating(false);
    setWaitingProgress(0);
    onError?.(error);
  };

  // Renderizar campo de pregunta
  const renderQuestionField = (question: PreQuestion) => {
    const value = userAnswers[question.key] || "";

    switch (question.type) {
      case "textarea":
        return (
          <textarea
            className="w-full min-h-[100px] p-3 rounded-md border bg-background text-sm resize-y"
            placeholder={question.example || "Escribe tu respuesta..."}
            value={value as string}
            onChange={(e) => handleAnswerChange(question.key, e.target.value)}
          />
        );
      
      case "select":
        return (
          <select
            className="w-full p-2 rounded-md border bg-background text-sm"
            value={value as string}
            onChange={(e) => handleAnswerChange(question.key, e.target.value)}
          >
            <option value="">Selecciona una opción...</option>
            {question.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      
      case "multi-select":
        {
        const currentValues = normalizeMultiValue(value as string | string[] | undefined);
        return (
          <div className="flex flex-wrap gap-2">
            {question.options?.map((opt) => {
              const selected = currentValues.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const current = currentValues;
                    const updated = selected
                      ? current.filter((v) => v !== opt)
                      : [...current, opt];
                    handleAnswerChange(question.key, updated);
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );
      }
      
      default:
        return (
          <input
            type="text"
            className="w-full p-2 rounded-md border bg-background text-sm"
            placeholder={question.example || "Escribe tu respuesta..."}
            value={value as string}
            onChange={(e) => handleAnswerChange(question.key, e.target.value)}
          />
        );
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Generar con IA</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <CardDescription>
          Genera contenido automáticamente para este módulo usando IA
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Preguntas Pre-Generation */}
          {preQuestions.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Preguntas de Contexto
              </label>
              <p className="text-xs text-muted-foreground">
                Opcional: si ya completaste el cuestionario inicial, puedes generar directamente.
              </p>
              <div className="space-y-3">
                {preQuestions.map((question) => (
                  <div
                    key={question.key}
                    className="space-y-1.5 rounded-lg border border-border/70 bg-muted/20 p-3"
                  >
                    <label className="text-xs text-muted-foreground">
                      {question.question}
                    </label>
                    {renderQuestionField(question)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de Generación */}
          <AIGenerateButton
            brandId={brandId}
            moduleKey={moduleKey}
            userAnswers={userAnswers}
            onGenerationStart={handleGenerationStart}
            onGenerationComplete={handleGenerationComplete}
            onGenerationError={handleGenerationError}
            disabled={disabled || isGenerating}
            disabledReason={disabled ? "Generación no disponible" : undefined}
            fullWidth
            showCostEstimate={false}
            showModelBadge={false}
          >
            Generar con IA
          </AIGenerateButton>

          {isGenerating && (
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${waitingProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Generando respuesta con IA...</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ============================================
// HELPERS
// ============================================

function findModuleDefinition(moduleKey: string) {
  for (const phase of phases) {
    const matchedModule = phase.modules.find(m => m.key === moduleKey);
    if (matchedModule) return matchedModule;
  }
  return null;
}
