"use client";

import React, { useState, useCallback, useMemo } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Layout, MousePointer, Type, Square, CreditCard, List,
    Download, Copy, Settings, Eye, Code, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// Types
interface ComponentConfig {
    id: string;
    name: string;
    category: "buttons" | "inputs" | "cards" | "navigation" | "feedback" | "layout";
    description: string;
    props: Record<string, PropConfig>;
    variants?: Record<string, Record<string, any>>;
}

interface PropConfig {
    type: "select" | "text" | "number" | "boolean" | "color" | "size";
    value: any;
    options?: string[];
    label: string;
}

interface UiKitData {
    components: Record<string, any>;
    customComponents?: ComponentConfig[];
}

// Component Definitions
const componentDefinitions: ComponentConfig[] = [
    // BUTTONS
    {
        id: "button-primary",
        name: "Primary Button",
        category: "buttons",
        description: "Botón principal para acciones principales",
        props: {
            variant: { type: "select", value: "default", options: ["default", "destructive", "outline", "secondary", "ghost", "link"], label: "Variant" },
            size: { type: "select", value: "default", options: ["default", "sm", "lg", "icon"], label: "Size" },
            label: { type: "text", value: "Click me", label: "Label" },
            disabled: { type: "boolean", value: false, label: "Disabled" },
        }
    },
    {
        id: "button-group",
        name: "Button Group",
        category: "buttons",
        description: "Grupo de botones relacionados",
        props: {
            orientation: { type: "select", value: "horizontal", options: ["horizontal", "vertical"], label: "Orientation" },
            size: { type: "select", value: "default", options: ["sm", "default", "lg"], label: "Size" },
        }
    },

    // INPUTS
    {
        id: "input-text",
        name: "Text Input",
        category: "inputs",
        description: "Campo de entrada de texto",
        props: {
            placeholder: { type: "text", value: "Enter text...", label: "Placeholder" },
            disabled: { type: "boolean", value: false, label: "Disabled" },
            type: { type: "select", value: "text", options: ["text", "email", "password", "number"], label: "Type" },
        }
    },
    {
        id: "textarea",
        name: "Textarea",
        category: "inputs",
        description: "Campo de texto multilínea",
        props: {
            placeholder: { type: "text", value: "Enter your message...", label: "Placeholder" },
            rows: { type: "number", value: 3, label: "Rows" },
            disabled: { type: "boolean", value: false, label: "Disabled" },
        }
    },
    {
        id: "checkbox",
        name: "Checkbox",
        category: "inputs",
        description: "Casilla de verificación",
        props: {
            label: { type: "text", value: "Accept terms and conditions", label: "Label" },
            checked: { type: "boolean", value: false, label: "Checked" },
            disabled: { type: "boolean", value: false, label: "Disabled" },
        }
    },
    {
        id: "switch",
        name: "Switch",
        category: "inputs",
        description: "Interruptor de activación",
        props: {
            label: { type: "text", value: "Enable notifications", label: "Label" },
            checked: { type: "boolean", value: false, label: "Checked" },
            disabled: { type: "boolean", value: false, label: "Disabled" },
        }
    },
    {
        id: "slider",
        name: "Slider",
        category: "inputs",
        description: "Control deslizante para valores numéricos",
        props: {
            min: { type: "number", value: 0, label: "Min" },
            max: { type: "number", value: 100, label: "Max" },
            step: { type: "number", value: 1, label: "Step" },
            value: { type: "number", value: 50, label: "Default Value" },
        }
    },

    // CARDS
    {
        id: "card-basic",
        name: "Basic Card",
        category: "cards",
        description: "Tarjeta básica con contenido",
        props: {
            title: { type: "text", value: "Card Title", label: "Title" },
            description: { type: "text", value: "Card description goes here", label: "Description" },
            showAction: { type: "boolean", value: true, label: "Show Action" },
        }
    },
    {
        id: "card-media",
        name: "Media Card",
        category: "cards",
        description: "Tarjeta con imagen y contenido",
        props: {
            title: { type: "text", value: "Featured Post", label: "Title" },
            subtitle: { type: "text", value: "January 1, 2025", label: "Subtitle" },
            description: { type: "text", value: "This is a longer description for the media card component.", label: "Description" },
        }
    },

    // NAVIGATION
    {
        id: "breadcrumb",
        name: "Breadcrumb",
        category: "navigation",
        description: "Navegación de migajas de pan",
        props: {
            items: { type: "text", value: "Home > Products > Category > Item", label: "Items (separator >)" },
        }
    },
    {
        id: "tabs",
        name: "Tabs",
        category: "navigation",
        description: "Pestañas de navegación",
        props: {
            tabs: { type: "text", value: "Overview,Features,Pricing,About", label: "Tabs (comma separated)" },
            activeTab: { type: "select", value: "Overview", options: ["Overview", "Features", "Pricing", "About"], label: "Active Tab" },
        }
    },

    // FEEDBACK
    {
        id: "alert",
        name: "Alert",
        category: "feedback",
        description: "Mensaje de alerta o notificación",
        props: {
            variant: { type: "select", value: "default", options: ["default", "destructive", "warning", "success", "info"], label: "Variant" },
            title: { type: "text", value: "Important notice", label: "Title" },
            message: { type: "text", value: "This is an important message that requires your attention.", label: "Message" },
        }
    },
    {
        id: "badge",
        name: "Badge",
        category: "feedback",
        description: "Etiqueta o insignia",
        props: {
            variant: { type: "select", value: "default", options: ["default", "secondary", "destructive", "outline", "success", "info"], label: "Variant" },
            label: { type: "text", value: "New", label: "Label" },
        }
    },
    {
        id: "progress",
        name: "Progress Bar",
        category: "feedback",
        description: "Barra de progreso",
        props: {
            value: { type: "number", value: 66, label: "Progress (%)" },
            showLabel: { type: "boolean", value: true, label: "Show Label" },
        }
    },

    // LAYOUT
    {
        id: "divider",
        name: "Divider",
        category: "layout",
        description: "Separador visual",
        props: {
            orientation: { type: "select", value: "horizontal", options: ["horizontal", "vertical"], label: "Orientation" },
            label: { type: "text", value: "OR", label: "Label (optional)" },
        }
    },
    {
        id: "skeleton",
        name: "Skeleton",
        category: "layout",
        description: "Esqueleto de carga",
        props: {
            type: { type: "select", value: "card", options: ["card", "text", "avatar"], label: "Type" },
        }
    },
];

// Render Functions for each component
function renderComponent(componentId: string, props: Record<string, any>) {
    switch (componentId) {
        case "button-primary":
            return (
                <Button
                    key={componentId}
                    variant={props.variant as any}
                    size={props.size as any}
                    disabled={props.disabled}
                >
                    {props.label}
                </Button>
            );

        case "button-group":
            return (
                <div key={componentId} className={`flex ${props.orientation === "vertical" ? "flex-col gap-2" : "gap-2"}`}>
                    <Button size={props.size === "default" ? "default" : props.size as any}>One</Button>
                    <Button size={props.size === "default" ? "default" : props.size as any} variant="secondary">Two</Button>
                    <Button size={props.size === "default" ? "default" : props.size as any} variant="outline">Three</Button>
                </div>
            );

        case "input-text":
            return (
                <Input
                    key={componentId}
                    type={props.type}
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                />
            );

        case "textarea":
            return (
                <Textarea
                    key={componentId}
                    placeholder={props.placeholder}
                    rows={props.rows}
                    disabled={props.disabled}
                />
            );

        case "checkbox":
            return (
                <div key={componentId} className="flex items-center space-x-2">
                    <Checkbox id="chk" checked={props.checked} disabled={props.disabled} />
                    <Label htmlFor="chk">{props.label}</Label>
                </div>
            );

        case "switch":
            return (
                <div key={componentId} className="flex items-center space-x-2">
                    <Switch id="sw" checked={props.checked} disabled={props.disabled} />
                    <Label htmlFor="sw">{props.label}</Label>
                </div>
            );

        case "slider":
            return (
                <div key={componentId} className="w-full space-y-2">
                    <Slider
                        value={[props.value]}
                        min={props.min}
                        max={props.max}
                        step={props.step}
                        className="w-full"
                    />
                    <span className="text-sm text-zinc-500">{props.value}</span>
                </div>
            );

        case "card-basic":
            return (
                <div key={componentId} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">{props.title}</h3>
                    <p className="text-zinc-400 text-sm">{props.description}</p>
                    {props.showAction && <Button>Action</Button>}
                </div>
            );

        case "card-media":
            return (
                <div key={componentId} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-amber-500/20 to-purple-500/20" />
                    <div className="p-6 space-y-2">
                        <p className="text-xs text-zinc-500">{props.subtitle}</p>
                        <h3 className="text-lg font-semibold text-white">{props.title}</h3>
                        <p className="text-zinc-400 text-sm">{props.description}</p>
                    </div>
                </div>
            );

        case "breadcrumb":
            return (
                <div key={componentId} className="flex items-center text-sm text-zinc-400">
                    {props.items.split(">").map((item: string, i: number, arr: string[]) => (
                        <React.Fragment key={i}>
                            <span className={i === arr.length - 1 ? "text-white" : "hover:text-zinc-300 cursor-pointer"}>
                                {item.trim()}
                            </span>
                            {i < arr.length - 1 && <span className="mx-2 text-zinc-600">/</span>}
                        </React.Fragment>
                    ))}
                </div>
            );

        case "tabs":
            const tabList = props.tabs.split(",");
            return (
                <div key={componentId} className="w-full">
                    <div className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 p-1">
                        {tabList.map((tab: string) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                    props.activeTab === tab.trim()
                                        ? "bg-zinc-800 text-white"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                {tab.trim()}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <p className="text-sm text-zinc-400">Content for <span className="text-white font-medium">{props.activeTab}</span></p>
                    </div>
                </div>
            );

        case "alert":
            const variantColors = {
                default: "bg-zinc-900 border-zinc-800 text-white",
                destructive: "bg-red-500/10 border-red-500/50 text-red-400",
                warning: "bg-amber-500/10 border-amber-500/50 text-amber-400",
                success: "bg-emerald-500/10 border-emerald-500/50 text-emerald-400",
                info: "bg-blue-500/10 border-blue-500/50 text-blue-400",
            };
            return (
                <Alert key={componentId} className={variantColors[props.variant as keyof typeof variantColors]}>
                    <AlertDescription>
                        <span className="font-medium">{props.title}</span>
                        <p className="mt-1 text-sm opacity-80">{props.message}</p>
                    </AlertDescription>
                </Alert>
            );

        case "badge":
            const badgeColors = {
                default: "bg-zinc-800 text-zinc-300",
                secondary: "bg-zinc-700 text-zinc-300",
                destructive: "bg-red-500/20 text-red-400 border border-red-500/50",
                outline: "border border-zinc-700 text-zinc-300",
                success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50",
                info: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
            };
            return (
                <Badge key={componentId} className={badgeColors[props.variant as keyof typeof badgeColors]}>
                    {props.label}
                </Badge>
            );

        case "progress":
            return (
                <div key={componentId} className="w-full space-y-2">
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all" style={{ width: `${props.value}%` }} />
                    </div>
                    {props.showLabel && <span className="text-sm text-zinc-500">{props.value}%</span>}
                </div>
            );

        case "divider":
            return (
                <div key={componentId} className={`flex items-center ${props.orientation === "vertical" ? "h-24" : "w-full"}`}>
                    <div className={`flex-1 ${props.orientation === "vertical" ? "h-full w-px" : "h-px"} bg-zinc-800`} />
                    {props.label && <span className="px-4 text-sm text-zinc-500">{props.label}</span>}
                    <div className={`flex-1 ${props.orientation === "vertical" ? "h-full w-px" : "h-px"} bg-zinc-800`} />
                </div>
            );

        case "skeleton":
            if (props.type === "card") {
                return (
                    <div key={componentId} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                        <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-zinc-800/50 rounded w-full animate-pulse" />
                        <div className="h-3 bg-zinc-800/50 rounded w-5/6 animate-pulse" />
                    </div>
                );
            } else if (props.type === "avatar") {
                return (
                    <div key={componentId} className="h-10 w-10 rounded-full bg-zinc-800 animate-pulse" />
                );
            }
            return (
                <div key={componentId} className="space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-full animate-pulse" />
                    <div className="h-4 bg-zinc-800/50 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-zinc-800/50 rounded w-4/6 animate-pulse" />
                </div>
            );

        default:
            return <div key={componentId}>Unknown component</div>;
    }
}

// Props Editor Component
interface PropsEditorProps {
    config: ComponentConfig;
    values: Record<string, any>;
    onChange: (values: Record<string, any>) => void;
}

function PropsEditor({ config, values, onChange }: PropsEditorProps) {
    const updateProp = useCallback((key: string, value: any) => {
        onChange({ ...values, [key]: value });
    }, [values, onChange]);

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-medium text-white">Props</h4>
            {Object.entries(config.props).map(([propKey, propConfig]) => (
                <div key={propKey} className="space-y-2">
                    <Label className="text-xs text-zinc-400">{propConfig.label}</Label>
                    {propConfig.type === "select" ? (
                        <select
                            value={values[propKey]}
                            onChange={e => updateProp(propKey, e.target.value)}
                            className="w-full h-9 bg-zinc-950 border border-zinc-800 rounded px-3 text-sm text-white"
                        >
                            {propConfig.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : propConfig.type === "boolean" ? (
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={values[propKey]}
                                onCheckedChange={v => updateProp(propKey, v)}
                            />
                            <span className="text-sm text-zinc-400">{values[propKey] ? "Yes" : "No"}</span>
                        </div>
                    ) : propConfig.type === "number" ? (
                        <Input
                            type="number"
                            value={values[propKey]}
                            onChange={e => updateProp(propKey, parseInt(e.target.value) || 0)}
                            className="h-9 bg-zinc-950 border-zinc-800"
                        />
                    ) : (
                        <Input
                            value={values[propKey]}
                            onChange={e => updateProp(propKey, e.target.value)}
                            className="h-9 bg-zinc-950 border-zinc-800"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// Code Generator
function generateComponentCode(componentId: string, config: ComponentConfig, values: Record<string, any>, framework: "react" | "tailwind" | "css") {
    const propsString = Object.entries(config.props)
        .filter(([key, prop]) => values[key] !== prop.value)
        .map(([key, prop]) => {
            if (prop.type === "boolean") return values[key] ? key : "";
            return `${key}="${typeof values[key] === "boolean" ? values[key] : values[key]}"`;
        })
        .filter(Boolean)
        .join(" ");

    if (framework === "react") {
        const componentName = config.name.replace(/\s+/g, "");
        return `<${componentName}${propsString ? " " + propsString : ""} />`;
    }

    if (framework === "tailwind") {
        return `<div class="/* Tailwind classes */">${propsString}</div>`;
    }

    return `.${componentId.replace(/\s+/g, "-").toLowerCase()} { /* CSS */ }`;
}

// Component Catalog Item
interface ComponentCatalogItemProps {
    config: ComponentConfig;
    onSelect: (config: ComponentConfig) => void;
    isSelected: boolean;
}

function ComponentCatalogItem({ config, onSelect, isSelected }: ComponentCatalogItemProps) {
    const defaultProps = useMemo(() => {
        const props: Record<string, any> = {};
        Object.entries(config.props).forEach(([key, prop]) => {
            props[key] = prop.value;
        });
        return props;
    }, [config]);

    return (
        <button
            onClick={() => onSelect(config)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-white">{config.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 capitalize">{config.category}</span>
            </div>
            <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{config.description}</p>
            <div className="flex justify-center p-4 bg-white rounded-lg">
                {renderComponent(config.id, defaultProps)}
            </div>
        </button>
    );
}

// Main Component
export default function UiKitWorkspace({ brandId }: { brandId: string }) {
    const [selectedComponent, setSelectedComponent] = useState<ComponentConfig | null>(componentDefinitions[0]);
    const [componentProps, setComponentProps] = useState<Record<string, any>>({});
    const [exportFormat, setExportFormat] = useState<"react" | "tailwind" | "css">("react");

    // Initialize props when component changes
    const handleSelectComponent = useCallback((config: ComponentConfig) => {
        setSelectedComponent(config);
        const defaultProps: Record<string, any> = {};
        Object.entries(config.props).forEach(([key, prop]) => {
            defaultProps[key] = prop.value;
        });
        setComponentProps(defaultProps);
    }, []);

    // Initialize first component on mount
    React.useEffect(() => {
        const defaultProps: Record<string, any> = {};
        Object.entries(componentDefinitions[0].props).forEach(([key, prop]) => {
            defaultProps[key] = prop.value;
        });
        setComponentProps(defaultProps);
    }, []);

    const categoryGroups = useMemo(() => {
        const groups: Record<string, ComponentConfig[]> = {};
        componentDefinitions.forEach(comp => {
            if (!groups[comp.category]) groups[comp.category] = [];
            groups[comp.category].push(comp);
        });
        return groups;
    }, []);

    const handleCopyCode = useCallback(() => {
        if (!selectedComponent) return;
        const code = generateComponentCode(selectedComponent.id, selectedComponent, componentProps, exportFormat);
        navigator.clipboard.writeText(code);
        toast.success("Código copiado al portapapeles");
    }, [selectedComponent, componentProps, exportFormat]);

    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="uiKit"
            moduleName="UI Kit"
            moduleSubtitle="Biblioteca de componentes y elementos de interfaz"
            backLink={`/dashboard/brands/${brandId}`}
        >
            {({ data, saveModule }) => (
                <div className="h-full flex flex-col">
                    <Tabs defaultValue="catalog" className="h-full flex flex-col">
                        <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                            <TabsList className="bg-transparent h-12 p-0 gap-6">
                                <TabsTrigger value="catalog" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Layout size={14} className="mr-2" /> Catálogo
                                </TabsTrigger>
                                <TabsTrigger value="playground" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Settings size={14} className="mr-2" /> Playground
                                </TabsTrigger>
                                <TabsTrigger value="export" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Code size={14} className="mr-2" /> Exportar
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            <div className="flex-1 bg-[#0A0A0A]">
                                <ScrollArea className="h-full">
                                    {/* Catalog Tab */}
                                    <TabsContent value="catalog" className="m-0 focus:outline-none">
                                        <div className="p-6 space-y-8">
                                            {Object.entries(categoryGroups).map(([category, components]) => (
                                                <section key={category}>
                                                    <h3 className="text-lg font-semibold text-white mb-4 capitalize flex items-center gap-2">
                                                        {category === "buttons" && <MousePointer size={18} className="text-amber-500" />}
                                                        {category === "inputs" && <Type size={18} className="text-amber-500" />}
                                                        {category === "cards" && <CreditCard size={18} className="text-amber-500" />}
                                                        {category === "navigation" && <List size={18} className="text-amber-500" />}
                                                        {category === "feedback" && <Eye size={18} className="text-amber-500" />}
                                                        {category === "layout" && <Square size={18} className="text-amber-500" />}
                                                        {category}
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                        {components.map(comp => (
                                                            <ComponentCatalogItem
                                                                key={comp.id}
                                                                config={comp}
                                                                onSelect={handleSelectComponent}
                                                                isSelected={selectedComponent?.id === comp.id}
                                                            />
                                                        ))}
                                                    </div>
                                                </section>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    {/* Playground Tab */}
                                    <TabsContent value="playground" className="m-0 focus:outline-none">
                                        {selectedComponent ? (
                                            <div className="flex h-full">
                                                {/* Props Panel */}
                                                <div className="w-80 border-r border-zinc-800 p-6 bg-zinc-950 overflow-y-auto">
                                                    <div className="space-y-6">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-white">{selectedComponent.name}</h3>
                                                            <p className="text-sm text-zinc-500 mt-1">{selectedComponent.description}</p>
                                                        </div>
                                                        <PropsEditor
                                                            config={selectedComponent}
                                                            values={componentProps}
                                                            onChange={setComponentProps}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Preview Area */}
                                                <div className="flex-1 p-8">
                                                    <div className="bg-white rounded-xl p-12 flex items-center justify-center min-h-[400px]">
                                                        {renderComponent(selectedComponent.id, componentProps)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-zinc-500">
                                                Selecciona un componente del catálogo para editarlo
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Export Tab */}
                                    <TabsContent value="export" className="m-0 focus:outline-none">
                                        <div className="p-6 space-y-6">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">Exportar Componentes</h3>
                                                <p className="text-sm text-zinc-500">Genera código para usar en tus proyectos</p>
                                            </div>

                                            {/* Format Selection */}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant={exportFormat === "react" ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setExportFormat("react")}
                                                    className={exportFormat === "react" ? "" : "bg-zinc-900 border-zinc-700"}
                                                >
                                                    React
                                                </Button>
                                                <Button
                                                    variant={exportFormat === "tailwind" ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setExportFormat("tailwind")}
                                                    className={exportFormat === "tailwind" ? "" : "bg-zinc-900 border-zinc-700"}
                                                >
                                                    Tailwind
                                                </Button>
                                                <Button
                                                    variant={exportFormat === "css" ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setExportFormat("css")}
                                                    className={exportFormat === "css" ? "" : "bg-zinc-900 border-zinc-700"}
                                                >
                                                    CSS
                                                </Button>
                                            </div>

                                            {/* Selected Component Code */}
                                            {selectedComponent && (
                                                <div className="bg-zinc-950 rounded-xl overflow-hidden">
                                                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                                                        <span className="text-sm font-medium text-white">{selectedComponent.name}</span>
                                                        <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                                                            <Copy size={14} className="mr-2" /> Copiar
                                                        </Button>
                                                    </div>
                                                    <div className="p-4">
                                                        <pre className="text-sm text-zinc-300 font-mono overflow-x-auto">
                                                            <code>
                                                                {generateComponentCode(selectedComponent.id, selectedComponent, componentProps, exportFormat)}
                                                            </code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            {/* All Components Export */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-medium text-white">Todos los Componentes</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {componentDefinitions.map(comp => {
                                                        const defaultProps: Record<string, any> = {};
                                                        Object.entries(comp.props).forEach(([key, prop]) => {
                                                            defaultProps[key] = prop.value;
                                                        });
                                                        return (
                                                            <div key={comp.id} className="bg-zinc-950 rounded-xl p-4 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium text-white">{comp.name}</span>
                                                                    <span className="text-xs text-zinc-500 capitalize">{comp.category}</span>
                                                                </div>
                                                                <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">
                                                                    {generateComponentCode(comp.id, comp, defaultProps, exportFormat)}
                                                                </pre>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </ScrollArea>
                            </div>

                            {/* Preview Sidebar */}
                            <div className="w-80 border-l border-zinc-800 bg-[#050505] overflow-y-auto">
                                {selectedComponent ? (
                                    <div className="p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-white">Preview</h3>
                                            <Eye size={18} className="text-zinc-500" />
                                        </div>

                                        <div className="bg-white rounded-xl p-8">
                                            {renderComponent(selectedComponent.id, componentProps)}
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-white">Configuración Actual</h4>
                                            <div className="space-y-2">
                                                {Object.entries(componentProps).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-center py-2 border-b border-zinc-800">
                                                        <span className="text-xs text-zinc-400 capitalize">{key}</span>
                                                        <span className="text-xs text-white font-mono bg-zinc-900 px-2 py-1 rounded">
                                                            {String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Button variant="outline" className="w-full" onClick={() => {
                                                handleSelectComponent(selectedComponent);
                                                toast.success("Props reseteados a valores default");
                                            }}>
                                                Resetear Props
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-zinc-500">
                                        <Eye size={32} className="mx-auto mb-4 opacity-50" />
                                        <p>Selecciona un componente para ver el preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Tabs>
                </div>
            )}
        </BaseWorkspace>
    );
}
