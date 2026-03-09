"use client";

import React, { useState, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { List, Edit, Eye, Download, Check, X, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { WorkspaceContentProps } from "@/lib/workspace/types";

interface FormField {
    name: string;
    label: string;
    placeholder: string;
    required: boolean;
    type: "text" | "email" | "textarea" | "select" | "checkbox";
}

interface FormsData {
    inputStyles: {
        borderRadius: string;
        paddingX: string;
        paddingY: string;
        fontSize: string;
        borderColor: string;
        focusColor: string;
        errorColor: string;
    };
    fields: FormField[];
}

const defaultFormsData: FormsData = {
    inputStyles: {
        borderRadius: "8px",
        paddingX: "12px",
        paddingY: "10px",
        fontSize: "14px",
        borderColor: "#374151",
        focusColor: "#3B82F6",
        errorColor: "#EF4444"
    },
    fields: [
        { name: "nombre", label: "Nombre completo", placeholder: "Juan Pérez", required: true, type: "text" },
        { name: "email", label: "Correo electrónico", placeholder: "juan@ejemplo.com", required: true, type: "email" },
        { name: "mensaje", label: "Mensaje", placeholder: "Escribe tu mensaje...", required: true, type: "textarea" },
        { name: "terminos", label: "Acepto los términos y condiciones", placeholder: "", required: true, type: "checkbox" }
    ]
};

function FormsWorkspaceContent({ data, saveModule }: WorkspaceContentProps) {
    const [formsData, setFormsData] = useState<FormsData>(
        data?.content?.formsData || defaultFormsData
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

    const updateStyle = useCallback((key: keyof FormsData["inputStyles"], value: string) => {
        setFormsData(prev => ({
            ...prev,
            inputStyles: { ...prev.inputStyles, [key]: value }
        }));
        setHasChanges(true);
    }, []);

    const handleSave = async () => {
        const success = await saveModule({
            ...data,
            content: { ...data?.content, formsData }
        });
        if (success) setHasChanges(false);
    };

    const handleDiscard = () => {
        setFormsData(data?.content?.formsData || defaultFormsData);
        setHasChanges(false);
    };

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Tienes cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDiscard}>Descartar</Button>
                        <Button size="sm" onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="overview"><List size={14} className="mr-2" /> Resumen</TabsTrigger>
                        <TabsTrigger value="editor"><Edit size={14} className="mr-2" /> Editor</TabsTrigger>
                        <TabsTrigger value="preview"><Eye size={14} className="mr-2" /> Vista Previa</TabsTrigger>
                        <TabsTrigger value="export"><Download size={14} className="mr-2" /> Exportar</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <TabsContent value="overview" className="m-0 focus:outline-none p-6">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Sistema de Formularios</h2>
                                    <p className="text-zinc-400">Define los estilos, estados y validaciones para campos de entrada.</p>
                                </div>

                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Componentes del Sistema</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-lg">
                                            <div className="p-2 bg-blue-500/20 rounded-lg"><Input size={20} className="text-blue-500" /></div>
                                            <div>
                                                <h4 className="text-white font-medium">Inputs</h4>
                                                <p className="text-sm text-zinc-500">Campos de texto y email</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-lg">
                                            <div className="p-2 bg-green-500/20 rounded-lg"><FileText size={20} className="text-green-500" /></div>
                                            <div>
                                                <h4 className="text-white font-medium">Textareas</h4>
                                                <p className="text-sm text-zinc-500">Áreas de texto multilínea</p>
                                            </div>
                                        </div>
                                                                        <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-lg">
                                                                            <div className="p-2 bg-amber-500/20 rounded-lg"><Check size={20} className="text-amber-500" /></div>
                                                                            <div>
                                                                                <h4 className="text-white font-medium">Validaciones</h4>
                                                                                <p className="text-sm text-zinc-500">Estados de error y éxito</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="editor" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto space-y-6">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-white mb-4">Estilos de Inputs</h3>
                                                                </div>

                                                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                        <div>
                                                                            <Label className="text-sm text-zinc-400">Border Radius</Label>
                                                                            <Input
                                                                                value={formsData.inputStyles.borderRadius}
                                                                                onChange={e => updateStyle("borderRadius", e.target.value)}
                                                                                placeholder="8px"
                                                                                className="font-mono text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-sm text-zinc-400">Padding X</Label>
                                                                            <Input
                                                                                value={formsData.inputStyles.paddingX}
                                                                                onChange={e => updateStyle("paddingX", e.target.value)}
                                                                                placeholder="12px"
                                                                                className="font-mono text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-sm text-zinc-400">Padding Y</Label>
                                                                            <Input
                                                                                value={formsData.inputStyles.paddingY}
                                                                                onChange={e => updateStyle("paddingY", e.target.value)}
                                                                                placeholder="10px"
                                                                                className="font-mono text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-sm text-zinc-400">Font Size</Label>
                                                                            <Input
                                                                                value={formsData.inputStyles.fontSize}
                                                                                onChange={e => updateStyle("fontSize", e.target.value)}
                                                                                placeholder="14px"
                                                                                className="font-mono text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-sm text-zinc-400">Color Borde</Label>
                                                                            <div className="flex gap-2">
                                                                                <Input
                                                                                    type="color"
                                                                                    value={formsData.inputStyles.borderColor}
                                                                                    onChange={e => updateStyle("borderColor", e.target.value)}
                                                                                    className="w-10 h-10 p-1"
                                                                                />
                                                                                <Input
                                                                                    value={formsData.inputStyles.borderColor}
                                                                                    onChange={e => updateStyle("borderColor", e.target.value)}
                                                                                    className="flex-1 font-mono text-sm"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-sm text-zinc-400">Color Focus</Label>
                                                                            <div className="flex gap-2">
                                                                                <Input
                                                                                    type="color"
                                                                                    value={formsData.inputStyles.focusColor}
                                                                                    onChange={e => updateStyle("focusColor", e.target.value)}
                                                                                    className="w-10 h-10 p-1"
                                                                                />
                                                                                <Input
                                                                                    value={formsData.inputStyles.focusColor}
                                                                                    onChange={e => updateStyle("focusColor", e.target.value)}
                                                                                    className="flex-1 font-mono text-sm"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="preview" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-2xl mx-auto">
                                                                <div className="bg-white rounded-xl p-8">
                                                                    <h3 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Formulario de Contacto</h3>
                                                                    <div className="space-y-4">
                                                                        {formsData.fields.map(field => (
                                                                            <div key={field.name}>
                                                                                <Label className="text-zinc-700 text-sm mb-2 block">
                                                                                    {field.label}
                                                                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                                                                </Label>

                                                                                {field.type === "textarea" ? (
                                                                                    <Textarea
                                                                                        value={fieldValues[field.name] || ""}
                                                                                        onChange={e => setFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                                                        placeholder={field.placeholder}
                                                                                        className="w-full border-zinc-300 focus:ring-2 focus:ring-blue-500"
                                                                                        style={{
                                                                                            borderRadius: formsData.inputStyles.borderRadius,
                                                                                            fontSize: formsData.inputStyles.fontSize
                                                                                        }}
                                                                                    />
                                                                                ) : field.type === "checkbox" ? (
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Checkbox
                                                                                            checked={!!fieldValues[field.name]}
                                                                                            onCheckedChange={checked => setFieldValues(prev => ({ ...prev, [field.name]: String(checked) }))}
                                                                                        />
                                                                                        <span className="text-sm text-zinc-600">{field.label}</span>
                                                                                    </div>
                                                                                ) : (
                                                                                    <Input
                                                                                        type={field.type === "email" ? "email" : "text"}
                                                                                        value={fieldValues[field.name] || ""}
                                                                                        onChange={e => setFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                                                        placeholder={field.placeholder}
                                                                                        className="w-full"
                                                                                        style={{
                                                                                            borderRadius: formsData.inputStyles.borderRadius,
                                                                                            padding: `${formsData.inputStyles.paddingY} ${formsData.inputStyles.paddingX}`,
                                                                                            fontSize: formsData.inputStyles.fontSize,
                                                                                            border: `1px solid ${formsData.inputStyles.borderColor}`
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        ))}

                                                                        <Button
                                                                            onClick={() => toast.success("Formulario enviado (demo)")}
                                                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                                                            style={{
                                                                                borderRadius: formsData.inputStyles.borderRadius,
                                                                                padding: `${formsData.inputStyles.paddingY} ${formsData.inputStyles.paddingX}`
                                                                            }}
                                                                        >
                                                                            Enviar
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-6 space-y-4">
                                                                    <h4 className="text-white font-semibold mb-2">Estados de Validación</h4>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <p className="text-zinc-500 text-sm mb-2">Success</p>
                                                                            <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-3">
                                                                                <Check size={18} className="text-green-500" />
                                                                                <Input
                                                                                    value="juan@ejemplo.com"
                                                                                    className="flex-1 font-mono text-sm"
                                                                                    style={{ border: "2px solid #10B981", borderRadius: formsData.inputStyles.borderRadius }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-zinc-500 text-sm mb-2">Error</p>
                                                                            <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-3">
                                                                                <X size={18} className="text-red-500" />
                                                                                <Input
                                                                                    value="email-invalido"
                                                                                    className="flex-1 font-mono text-sm"
                                                                                    style={{ border: "2px solid #EF4444", borderRadius: formsData.inputStyles.borderRadius }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TabsContent>

                                                        <TabsContent value="export" className="m-0 focus:outline-none p-6">
                                                            <div className="max-w-3xl mx-auto space-y-6">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-white mb-2">Exportar Sistema de Formularios</h3>
                                                                    <p className="text-sm text-zinc-400">Genera CSS para tu sistema de inputs.</p>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                                                        onClick={() => {
                                                                            const css = `.form-input {
  border-radius: ${formsData.inputStyles.borderRadius};
  padding: ${formsData.inputStyles.paddingY} ${formsData.inputStyles.paddingX};
  font-size: ${formsData.inputStyles.fontSize};
  border: 1px solid ${formsData.inputStyles.borderColor};
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: ${formsData.inputStyles.focusColor};
  box-shadow: 0 0 0 3px ${formsData.inputStyles.focusColor}33;
}

.form-input.error {
  border-color: ${formsData.inputStyles.errorColor};
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px ${formsData.inputStyles.errorColor}33;
}`;
                                                                            navigator.clipboard.writeText(css);
                                                                            toast.success("CSS copiado");
                                                                        }}
                                                                    >
                                                                        <Download size={20} />
                                                                        <span className="font-medium">CSS</span>
                                                                        <span className="text-xs text-zinc-500">Estilos CSS</span>
                                                                    </Button>

                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-full flex-col items-center justify-center gap-3 p-6 hover:bg-zinc-900"
                                                                        onClick={() => {
                                                                            const json = JSON.stringify(formsData, null, 2);
                                                                            navigator.clipboard.writeText(json);
                                                                            toast.success("JSON copiado");
                                                                        }}
                                                                    >
                                                                        <Download size={20} />
                                                                        <span className="font-medium">JSON</span>
                                                                        <span className="text-xs text-zinc-500">Configuración</span>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </TabsContent>
                                                    </ScrollArea>
                                                </div>
                                            </Tabs>
                                        </div>
                                    );
}

export default function FormsWorkspace({ brandId }: { brandId: string }) {
    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="forms"
            moduleName="Sistema de Formularios"
            moduleSubtitle="Define estilos y validaciones para campos de entrada"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {(props) => <FormsWorkspaceContent {...props} />}
        </BaseWorkspace>
    );
}
