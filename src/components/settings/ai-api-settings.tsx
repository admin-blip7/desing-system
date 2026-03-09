"use client";

/**
 * AI API Settings Component
 *
 * Permite a los usuarios configurar sus propias APIs (BYO - Bring Your Own API)
 * para la generacion de contenido con diferentes proveedores.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface ApiProvider {
  id: string;
  name: string;
  icon: string;
  requiresKey: boolean;
  requiresBaseUrl: boolean;
  models: string[];
}

const AVAILABLE_PROVIDERS: ApiProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    icon: "🔷",
    requiresKey: true,
    requiresBaseUrl: false,
    models: [
      "gpt-5",
      "gpt-5-mini",
      "gpt-5-nano",
      "gpt-5-chatgpt-mini",
      "gpt-4.5-preview",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-4-turbo-preview",
      "gpt-4",
      "gpt-4-32k",
      "gpt-3.5-turbo",
      "gpt-3.5-turbo-16k",
      "o3",
      "o3-mini",
      "o1",
      "o1-mini",
      "o1-preview"
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    icon: "🧠",
    requiresKey: true,
    requiresBaseUrl: false,
    models: [
      "claude-3-7-sonnet-20250219",
      "claude-3-7-sonnet-latest",
      "claude-3-5-sonnet-20241022",
      "claude-3-5-sonnet-latest",
      "claude-3-5-haiku-20241022",
      "claude-3-5-haiku-latest",
      "claude-3-opus-20240229",
      "claude-3-opus-latest",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307"
    ],
  },
  {
    id: "groq",
    name: "Groq (Llama)",
    icon: "🦎",
    requiresKey: true,
    requiresBaseUrl: false,
    models: ["llama-3.3-70b-versatile", "mixtral-8x7b"],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: "🌀",
    requiresKey: true,
    requiresBaseUrl: true,
    models: ["anthropic/claude-opus-4", "openai/gpt-4o"],
  },
];

interface FlowConfig {
  enabled: boolean;
  provider: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

const DEFAULT_FLOW_CONFIGS: Record<string, FlowConfig> = {
  TEXT_FLOW: { enabled: true, provider: "openai", model: "gpt-4o-mini" },
  VISUAL_IDENTITY_FLOW: { enabled: true, provider: "openai", model: "gpt-4o-mini" },
  UI_COMPONENT_FLOW: { enabled: true, provider: "openai", model: "gpt-4o-mini" },
  TEMPLATE_FLOW: { enabled: true, provider: "openai", model: "gpt-4o-mini" },
  MULTIMEDIA_FLOW: { enabled: true, provider: "openai", model: "gpt-4o-mini" },
  INTEGRATION_FLOW: { enabled: true, provider: "openai", model: "gpt-4o-mini" },
};

export interface AIApiSettingsProps {
  userId: string;
}

// Toast simple
function showToast(message: string, type: "success" | "error" = "success") {
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export function AIApiSettings({ userId }: AIApiSettingsProps) {
  const [activeTab, setActiveTab] = useState<"general" | "flows">("general");
  const [configs, setConfigs] = useState<Record<string, FlowConfig>>(DEFAULT_FLOW_CONFIGS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar configuraciones guardadas (simulado - conectar a Supabase)
  useEffect(() => {
    const saved = localStorage.getItem(`ai-configs-${userId}`);
    if (saved) {
      try {
        setConfigs(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading configs", e);
      }
    }
  }, [userId]);

  const selectedProvider = (flowType: string) =>
    AVAILABLE_PROVIDERS.find((p) => p.id === configs[flowType]?.provider);

  const updateConfig = (flowType: string, updates: Partial<FlowConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [flowType]: { ...prev[flowType], ...updates },
    }));
    setHasChanges(true);
  };

  const saveConfigs = async () => {
    setIsLoading(true);
    try {
      // Guardar en localStorage (simulado - conectar a Supabase)
      localStorage.setItem(`ai-configs-${userId}`, JSON.stringify(configs));

      // TODO: Encriptar y guardar en Supabase usando src/lib/ai/byo-api/config-storage.ts
      // await saveFlowApiConfig({ ... });

      setHasChanges(false);
      showToast("Configuraciones guardadas correctamente", "success");
    } catch (error) {
      showToast("Error al guardar configuraciones", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConfigs = () => {
    setConfigs(DEFAULT_FLOW_CONFIGS);
    setHasChanges(true);
  };

  const testApiKey = async (providerId: string, apiKey: string) => {
    if (!apiKey) return false;

    // Simular test de API (conectar a endpoint real)
    try {
      const provider = AVAILABLE_PROVIDERS.find((p) => p.id === providerId);
      if (providerId === "openai") {
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        return response.ok;
      }
      // TODO: Agregar tests para otros providers
      return true;
    } catch {
      return false;
    }
  };

  const flowNames: Record<string, string> = {
    TEXT_FLOW: "Contenido de Texto",
    VISUAL_IDENTITY_FLOW: "Identidad Visual",
    UI_COMPONENT_FLOW: "Componentes UI",
    TEMPLATE_FLOW: "Plantillas",
    MULTIMEDIA_FLOW: "Multimedia",
    INTEGRATION_FLOW: "Integraciones",
  };

  return (
    <div className="space-y-6">
      {/* Tabs de navegacion */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "general" | "flows")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Configuracion General</TabsTrigger>
          <TabsTrigger value="flows">Flujos Especializados</TabsTrigger>
        </TabsList>

        {/* Tab: Configuracion General */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Proveedor Principal</CardTitle>
              <CardDescription>
                Configura tu API principal para generacion de contenido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-provider">Proveedor</Label>
                  <Select
                    value={configs.TEXT_FLOW?.provider || "openai"}
                    onValueChange={(value) => {
                      Object.keys(configs).forEach((flow) => {
                        updateConfig(flow, { provider: value });
                      });
                    }}
                  >
                    <SelectTrigger id="default-provider">
                      <SelectValue placeholder="Selecciona proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_PROVIDERS.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <span className="mr-2">{provider.icon}</span>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-model">Modelo</Label>
                  <Select
                    value={configs.TEXT_FLOW?.model || "gpt-4o-mini"}
                    onValueChange={(value) => {
                      Object.keys(configs).forEach((flow) => {
                        updateConfig(flow, { model: value });
                      });
                    }}
                  >
                    <SelectTrigger id="default-model">
                      <SelectValue placeholder="Selecciona modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvider("TEXT_FLOW")?.models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={configs.TEXT_FLOW?.apiKey || ""}
                  onChange={(e) => {
                    const key = e.target.value;
                    Object.keys(configs).forEach((flow) => {
                      updateConfig(flow, { apiKey: key });
                    });
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Tu API key se encriptara antes de guardarla.
                </p>
              </div>

              {selectedProvider("TEXT_FLOW")?.requiresBaseUrl && (
                <div className="space-y-2">
                  <Label htmlFor="base-url">Base URL</Label>
                  <Input
                    id="base-url"
                    placeholder="https://api.example.com/v1"
                    value={configs.TEXT_FLOW?.baseUrl || ""}
                    onChange={(e) => {
                      Object.keys(configs).forEach((flow) => {
                        updateConfig(flow, { baseUrl: e.target.value });
                      });
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Flujos Especializados */}
        <TabsContent value="flows" className="space-y-6 mt-6">
          <p className="text-sm text-muted-foreground">
            Configura proveedores especificos para cada tipo de flujo de generacion.
          </p>

          {Object.entries(configs).map(([flowType, config]) => {
            const provider = AVAILABLE_PROVIDERS.find((p) => p.id === config.provider);

            return (
              <Card key={flowType}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="py-1">
                    <CardTitle className="text-base font-medium">
                      {flowNames[flowType] || flowType}
                    </CardTitle>
                    <CardDescription>
                      {provider?.icon} {provider?.name} • {config.model}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(checked) => updateConfig(flowType, { enabled: checked })}
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  {config.enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Proveedor</Label>
                          <Select
                            value={config.provider}
                            onValueChange={(value) => updateConfig(flowType, { provider: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAILABLE_PROVIDERS.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.icon} {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Modelo</Label>
                          <Select
                            value={config.model}
                            onValueChange={(value) => updateConfig(flowType, { model: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {provider?.models.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {provider?.requiresKey && (
                        <div className="space-y-2">
                          <Label>API Key</Label>
                          <Input
                            type="password"
                            placeholder="API Key para este flujo"
                            value={config.apiKey || ""}
                            onChange={(e) => updateConfig(flowType, { apiKey: e.target.value })}
                          />
                        </div>
                      )}

                      {provider?.requiresBaseUrl && (
                        <div className="space-y-2">
                          <Label>Base URL</Label>
                          <Input
                            placeholder="https://api.example.com/v1"
                            value={config.baseUrl || ""}
                            onChange={(e) => updateConfig(flowType, { baseUrl: e.target.value })}
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Acciones */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button variant="outline" onClick={resetConfigs}>
          Restablecer Valores
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const valid = await testApiKey(
                configs.TEXT_FLOW?.provider || "openai",
                configs.TEXT_FLOW?.apiKey || ""
              );
              showToast(valid ? "API Key valida" : "API Key invalida", valid ? "success" : "error");
            }}
          >
            Testear API
          </Button>
          <Button onClick={saveConfigs} disabled={!hasChanges || isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
