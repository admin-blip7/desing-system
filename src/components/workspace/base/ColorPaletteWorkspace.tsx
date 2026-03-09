"use client";

import React, { useState, useCallback, useMemo } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { WorkspaceAIGenerator } from "@/components/workspace/shared/WorkspaceAIGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette, Layers, Sun, AlertCircle, CheckCircle, Info, Download, Copy, Trash2, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import chroma from "chroma-js";

// Types
interface ColorPaletteData {
    primary: string;
    secondary?: string;
    accent?: string;
    neutrals: Record<number, string>; // 50-950
    semantic: {
        success: string;
        warning: string;
        danger: string;
        info: string;
    };
    scales?: Record<string, Record<number, string>>; // Custom scales per color
}

const defaultPalette: ColorPaletteData = {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#F59E0B",
    neutrals: {
        50: "#FAFAFA", 100: "#F5F5F5", 200: "#E5E5E5", 300: "#D4D4D4",
        400: "#A3A3A3", 500: "#737373", 600: "#525252", 700: "#404040",
        800: "#262626", 900: "#171717", 950: "#0A0A0A"
    },
    semantic: {
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6"
    }
};

// Generate color scale using chroma-js
function generateColorScale(baseColor: string): Record<number, string> {
    try {
        const scale: Record<number, string> = {};
        const base = chroma(baseColor);

        // Lighter shades (50-400)
        scale[50] = base.brighten(2.5).hex();
        scale[100] = base.brighten(2).hex();
        scale[200] = base.brighten(1.5).hex();
        scale[300] = base.brighten(1).hex();
        scale[400] = base.brighten(0.5).hex();

        // Base
        scale[500] = base.hex();

        // Darker shades (600-950)
        scale[600] = base.darken(0.5).hex();
        scale[700] = base.darken(1).hex();
        scale[800] = base.darken(1.5).hex();
        scale[900] = base.darken(2).hex();
        scale[950] = base.darken(2.5).hex();

        return scale;
    } catch {
        return defaultPalette.neutrals;
    }
}

// WCAG Contrast Checker
function getContrastRatio(fg: string, bg: string): number {
    try {
        return chroma.contrast(fg, bg);
    } catch {
        return 1;
    }
}

function getWCAGRating(ratio: number, large: boolean = false): { level: string; pass: boolean } {
    if (large) {
        if (ratio >= 3) return { level: "AA", pass: true };
        if (ratio >= 4.5) return { level: "AAA", pass: true };
    } else {
        if (ratio >= 4.5) return { level: "AA", pass: true };
        if (ratio >= 7) return { level: "AAA", pass: true };
    }
    return { level: "Fail", pass: false };
}

// Color Card Component
interface ColorCardProps {
    label: string;
    color: string;
    onChange?: (color: string) => void;
    onDelete?: () => void;
    showRgb?: boolean;
    showHsl?: boolean;
}

function ColorCard({ label, color, onChange, onDelete, showRgb = true, showHsl = false }: ColorCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(color);
        setCopied(true);
        toast.success(`Copiado: ${color}`);
        setTimeout(() => setCopied(false), 1500);
    }, [color]);

    const rgb = useMemo(() => {
        try {
            const c = chroma(color);
            return c.rgb().join(", ");
        } catch { return ""; }
    }, [color]);

    const hsl = useMemo(() => {
        try {
            const c = chroma(color);
            return c.hsl().map((v, i) => i === 0 ? Math.round(v) + "°" : v.toFixed(1) + "%").join(", ");
        } catch { return ""; }
    }, [color]);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
            <div
                className="h-20 w-full relative transition-transform group-hover:scale-105"
                style={{ backgroundColor: color }}
            >
                {onChange && (
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                )}
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                    <Copy size={14} className={copied ? "text-green-400" : "text-white"} />
                </button>
            </div>
            <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-300 capitalize">{label}</span>
                    {onDelete && (
                        <button onClick={onDelete} className="text-zinc-600 hover:text-red-400 transition-colors">
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Input
                        value={color}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="h-6 text-xs font-mono bg-black border-zinc-800 flex-1"
                    />
                </div>
                {showRgb && (
                    <div className="text-[10px] text-zinc-500 font-mono">rgb({rgb})</div>
                )}
                {showHsl && (
                    <div className="text-[10px] text-zinc-500 font-mono">hsl({hsl})</div>
                )}
            </div>
        </div>
    );
}

// Color Scale Row Component
interface ScaleRowProps {
    step: number;
    color: string;
    onChange?: (step: number, color: string) => void;
    onCopy?: (color: string) => void;
}

function ScaleRow({ step, color, onChange, onCopy }: ScaleRowProps) {
    const luminance = useMemo(() => {
        try { return chroma(color).luminance(); }
        catch { return 0; }
    }, [color]);

    const textColor = luminance > 0.5 ? "#000" : "#fff";

    return (
        <div className="flex items-center gap-3 group">
            <div className="w-14 text-xs text-zinc-500 font-mono text-right">{step}</div>
            <div
                className="flex-1 h-14 rounded-l flex items-center justify-between px-3 transition-all group-hover:h-16 cursor-pointer relative"
                style={{ backgroundColor: color }}
            >
                <span className="text-xs font-mono" style={{ color: textColor, mixBlendMode: "difference" }}>
                    {color.toUpperCase()}
                </span>
                {onChange && (
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange(step, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                )}
                <button
                    onClick={() => onCopy?.(color)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
                >
                    <Copy size={12} style={{ color: textColor }} />
                </button>
            </div>
        </div>
    );
}

// Main Color Editor
interface PaletteEditorProps {
    data: ColorPaletteData;
    onChange: (data: ColorPaletteData) => void;
}

function PaletteEditor({ data, onChange }: PaletteEditorProps) {
    const updatePrimary = useCallback((color: string) => {
        const newScale = generateColorScale(color);
        onChange({
            ...data,
            primary: color,
            scales: {
                ...data.scales,
                primary: newScale
            }
        });
    }, [data, onChange]);

    const updateSecondary = useCallback((color: string) => {
        const newScale = generateColorScale(color);
        onChange({
            ...data,
            secondary: color,
            scales: {
                ...data.scales,
                secondary: newScale
            }
        });
    }, [data, onChange]);

    const updateAccent = useCallback((color: string) => {
        const newScale = generateColorScale(color);
        onChange({
            ...data,
            accent: color,
            scales: {
                ...data.scales,
                accent: newScale
            }
        });
    }, [data, onChange]);

    return (
        <div className="p-6 space-y-8">
            <section>
                <h3 className="text-lg font-semibold text-white mb-2">Colores Principales</h3>
                <p className="text-sm text-zinc-500 mb-6">Define los colores base de tu marca. Al editarlos se generará automáticamente la escala 50-950.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <ColorCard
                        label="Primary"
                        color={data.primary}
                        onChange={updatePrimary}
                        showRgb
                        showHsl
                    />
                    <ColorCard
                        label="Secondary"
                        color={data.secondary || "#8B5CF6"}
                        onChange={updateSecondary}
                        showRgb
                        showHsl
                    />
                    <ColorCard
                        label="Accent"
                        color={data.accent || "#F59E0B"}
                        onChange={updateAccent}
                        showRgb
                        showHsl
                    />
                </div>
            </section>
        </div>
    );
}

// Scale Generator Tab
interface ScaleGeneratorProps {
    data: ColorPaletteData;
    onChange: (data: ColorPaletteData) => void;
}

function ScaleGenerator({ data, onChange }: ScaleGeneratorProps) {
    const [selectedColor, setSelectedColor] = useState<"primary" | "secondary" | "accent">("primary");

    const currentScale = useMemo(() => {
        if (selectedColor === "primary" && !data.scales?.primary) {
            return generateColorScale(data.primary);
        }
        return data.scales?.[selectedColor] || generateColorScale(
            selectedColor === "primary" ? data.primary :
            selectedColor === "secondary" ? data.secondary || "#8B5CF6" :
            data.accent || "#F59E0B"
        );
    }, [data, selectedColor]);

    const handleColorChange = useCallback((step: number, color: string) => {
        onChange({
            ...data,
            scales: {
                ...data.scales,
                [selectedColor]: {
                    ...currentScale,
                    [step]: color
                }
            }
        });
    }, [data, selectedColor, currentScale, onChange]);

    const handleCopyAll = useCallback(() => {
        const scaleText = Object.entries(currentScale)
            .map(([step, color]) => `${step}: ${color}`)
            .join("\n");
        navigator.clipboard.writeText(scaleText);
        toast.success("Escala copiada al portapapeles");
    }, [currentScale]);

    const handleRegenerate = useCallback(() => {
        const baseColor = selectedColor === "primary" ? data.primary :
                         selectedColor === "secondary" ? data.secondary || "#8B5CF6" :
                         data.accent || "#F59E0B";
        const newScale = generateColorScale(baseColor);
        onChange({
            ...data,
            scales: {
                ...data.scales,
                [selectedColor]: newScale
            }
        });
        toast.success("Escala regenerada");
    }, [data, selectedColor, onChange]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Generador de Escalas</h3>
                    <p className="text-sm text-zinc-500">Escala 50-950 estilo Tailwind CSS</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRegenerate}>
                        Regenerar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopyAll}>
                        <Copy size={14} className="mr-2" /> Copiar Todo
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={selectedColor === "primary" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor("primary")}
                    className={selectedColor === "primary" ? "" : "bg-zinc-900 border-zinc-700"}
                    style={selectedColor === "primary" ? { backgroundColor: data.primary } : {}}
                >
                    Primary
                </Button>
                <Button
                    variant={selectedColor === "secondary" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor("secondary")}
                    className={selectedColor === "secondary" ? "" : "bg-zinc-900 border-zinc-700"}
                    style={selectedColor === "secondary" ? { backgroundColor: data.secondary } : {}}
                >
                    Secondary
                </Button>
                <Button
                    variant={selectedColor === "accent" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor("accent")}
                    className={selectedColor === "accent" ? "" : "bg-zinc-900 border-zinc-700"}
                    style={selectedColor === "accent" ? { backgroundColor: data.accent } : {}}
                >
                    Accent
                </Button>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 space-y-1">
                {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const).map((step) => (
                    <ScaleRow
                        key={step}
                        step={step}
                        color={currentScale[step]}
                        onChange={handleColorChange}
                        onCopy={(color) => {
                            navigator.clipboard.writeText(color);
                            toast.success(`Copiado: ${color}`);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// Semantic Colors Editor
function SemanticColorsEditor({ data, onChange }: PaletteEditorProps) {
    const updateSemantic = useCallback((key: keyof ColorPaletteData["semantic"], color: string) => {
        onChange({
            ...data,
            semantic: {
                ...data.semantic,
                [key]: color
            }
        });
    }, [data, onChange]);

    const semanticConfig = [
        { key: "success" as const, label: "Success", icon: CheckCircle, description: "Para confirmaciones y estados positivos" },
        { key: "warning" as const, label: "Warning", icon: AlertCircle, description: "Para alertas y advertencias" },
        { key: "danger" as const, label: "Danger", icon: AlertCircle, description: "Para errores y estados críticos" },
        { key: "info" as const, label: "Info", icon: Info, description: "Para información y notificaciones" },
    ];

    return (
        <div className="p-6 space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Colores Semánticos</h3>
                <p className="text-sm text-zinc-500">Colores con significado específico para estados de la interfaz.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {semanticConfig.map(({ key, label, icon: Icon, description }) => (
                    <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${data.semantic[key]}20`, color: data.semantic[key] }}>
                                <Icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-white">{label}</h4>
                                <p className="text-xs text-zinc-500">{description}</p>
                            </div>
                        </div>
                        <ColorCard
                            label={label.toLowerCase()}
                            color={data.semantic[key]}
                            onChange={(c) => updateSemantic(key, c)}
                            showRgb={false}
                        />
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">Preview</Label>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 p-2 rounded bg-zinc-950 border border-zinc-800">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.semantic[key] }} />
                                    <span className="text-xs text-zinc-400">Default state</span>
                                </div>
                                <div
                                    className="flex items-center gap-2 p-2 rounded border"
                                    style={{ backgroundColor: `${data.semantic[key]}15`, borderColor: data.semantic[key] }}
                                >
                                    <Icon size={12} style={{ color: data.semantic[key] }} />
                                    <span className="text-xs" style={{ color: data.semantic[key] }}>Alert message example</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Contrast Checker Tab
interface ContrastCheckerProps {
    data: ColorPaletteData;
}

function ContrastChecker({ data }: ContrastCheckerProps) {
    const [fgColor, setFgColor] = useState("#FFFFFF");
    const [bgColor, setBgColor] = useState(data.primary);
    const [isLargeText, setIsLargeText] = useState(false);

    const ratio = useMemo(() => getContrastRatio(fgColor, bgColor), [fgColor, bgColor]);
    const rating = useMemo(() => getWCAGRating(ratio, isLargeText), [ratio, isLargeText]);

    const paletteColors = useMemo(() => [
        { name: "Primary", color: data.primary },
        { name: "Secondary", color: data.secondary || "#8B5CF6" },
        { name: "Accent", color: data.accent || "#F59E0B" },
        { name: "Success", color: data.semantic.success },
        { name: "Warning", color: data.semantic.warning },
        { name: "Danger", color: data.semantic.danger },
        { name: "Info", color: data.semantic.info },
        ...Object.entries(data.neutrals).map(([step, color]) => ({ name: `Gray ${step}`, color })),
    ], [data]);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Verificador de Contraste WCAG</h3>
                <p className="text-sm text-zinc-500">Verifica que tus colores cumplan con los estándares de accesibilidad.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interactive Checker */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                    <h4 className="font-medium text-white">Prueba Interactiva</h4>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">Color de Fondo</Label>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-lg border border-zinc-700 shrink-0" style={{ backgroundColor: bgColor }} />
                                <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="font-mono" />
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-400">Color de Texto</Label>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-lg border border-zinc-700 shrink-0" style={{ backgroundColor: fgColor }} />
                                <Input value={fgColor} onChange={e => setFgColor(e.target.value)} className="font-mono" />
                                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="largeText"
                                checked={isLargeText}
                                onChange={e => setIsLargeText(e.target.checked)}
                                className="rounded border-zinc-700"
                            />
                            <Label htmlFor="largeText" className="text-xs text-zinc-400">Texto grande (18pt+ / 14pt bold)</Label>
                        </div>
                    </div>

                    <div className="text-center py-6 rounded-lg" style={{ backgroundColor: bgColor, color: fgColor }}>
                        <p className={`font-medium ${isLargeText ? "text-2xl" : "text-base"}`}>
                            El zorro veloz salta sobre el perro perezoso.
                        </p>
                        <p className={`mt-2 ${isLargeText ? "text-xl" : "text-sm"}`} style={{ opacity: 0.8 }}>
                            The quick brown fox jumps over the lazy dog.
                        </p>
                    </div>

                    <div className="text-center py-4 bg-zinc-950 rounded-lg">
                        <div className="text-4xl font-bold text-white">{ratio.toFixed(2)}:1</div>
                        <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                            rating.level === "Fail" ? "bg-red-500/20 text-red-400" :
                            rating.level === "AAA" ? "bg-emerald-500/20 text-emerald-400" :
                            "bg-amber-500/20 text-amber-400"
                        }`}>
                            WCAG {rating.level} {rating.pass ? "✓" : "✗"}
                        </div>
                    </div>
                </div>

                {/* Quick Palette Selection */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                    <h4 className="font-medium text-white">Seleccionar de Paleta</h4>
                    <div className="grid grid-cols-4 gap-2">
                        {paletteColors.map(palette => (
                            <button
                                key={palette.name}
                                onClick={() => setBgColor(palette.color)}
                                className="aspect-square rounded-lg border-2 border-transparent hover:border-white/50 transition-all relative group"
                                style={{ backgroundColor: palette.color }}
                                title={palette.name}
                            >
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                                    {palette.name}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setFgColor("#FFFFFF")} className="flex-1">
                            Texto Blanco
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setFgColor("#000000")} className="flex-1">
                            Texto Negro
                        </Button>
                    </div>
                </div>
            </div>

            {/* Full Accessibility Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800">
                    <h4 className="font-medium text-white">Tabla de Accesibilidad Completa</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-zinc-950">
                            <tr>
                                <th className="px-4 py-3 text-left text-zinc-400 font-medium">Color</th>
                                <th className="px-4 py-3 text-left text-zinc-400 font-medium">Texto Blanco</th>
                                <th className="px-4 py-3 text-left text-zinc-400 font-medium">Texto Negro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {paletteColors.slice(0, 7).map(color => (
                                <tr key={color.name}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded" style={{ backgroundColor: color.color }} />
                                            <span className="text-white">{color.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <AccessibilityBadge ratio={getContrastRatio("#FFFFFF", color.color)} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <AccessibilityBadge ratio={getContrastRatio("#000000", color.color)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AccessibilityBadge({ ratio }: { ratio: number }) {
    const aa = ratio >= 4.5;
    const aaa = ratio >= 7;

    return (
        <div className="flex items-center gap-2">
            <span className="text-white font-mono">{ratio.toFixed(1)}:1</span>
            <div className="flex gap-1">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${aa ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    AA {aa ? "✓" : "✗"}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${aaa ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    AAA {aaa ? "✓" : "✗"}
                </span>
            </div>
        </div>
    );
}

// Export Tab
interface ExportTabProps {
    data: ColorPaletteData;
}

interface TailwindExtendColors {
    primary: Record<string, string>;
    secondary?: string;
    accent?: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
}

interface TailwindExportConfig {
    theme: {
        extend: {
            colors: TailwindExtendColors;
        };
    };
}

function ExportTab({ data }: ExportTabProps) {
    const [format, setFormat] = useState<"css" | "tailwind" | "json" | "scss">("css");

    const generateCSS = useCallback(() => {
        let css = ":root {\n";
        css += `  /* Primary Colors */\n`;
        css += `  --color-primary: ${data.primary};\n`;
        if (data.secondary) css += `  --color-secondary: ${data.secondary};\n`;
        if (data.accent) css += `  --color-accent: ${data.accent};\n`;

        css += `\n  /* Semantic Colors */\n`;
        css += `  --color-success: ${data.semantic.success};\n`;
        css += `  --color-warning: ${data.semantic.warning};\n`;
        css += `  --color-danger: ${data.semantic.danger};\n`;
        css += `  --color-info: ${data.semantic.info};\n`;

        const primaryScale = data.scales?.primary || generateColorScale(data.primary);
        css += `\n  /* Primary Scale */\n`;
        Object.entries(primaryScale).forEach(([step, color]) => {
            css += `  --color-primary-${step}: ${color};\n`;
        });

        css += "}\n";
        return css;
    }, [data]);

    const generateTailwind = useCallback(() => {
        const primaryScale = data.scales?.primary || generateColorScale(data.primary);
        const primaryColors = Object.entries(primaryScale).reduce<Record<string, string>>((acc, [step, color]) => {
            acc[step] = color;
            return acc;
        }, {});

        const colors: TailwindExtendColors = {
            primary: primaryColors,
            success: data.semantic.success,
            warning: data.semantic.warning,
            danger: data.semantic.danger,
            info: data.semantic.info,
        };

        if (data.secondary) {
            colors.secondary = data.secondary;
        }
        if (data.accent) {
            colors.accent = data.accent;
        }

        const tw: TailwindExportConfig = {
            theme: {
                extend: {
                    colors,
                },
            },
        };

        return JSON.stringify(tw, null, 2);
    }, [data]);

    const generateJSON = useCallback(() => {
        return JSON.stringify({
            primary: data.primary,
            secondary: data.secondary,
            accent: data.accent,
            semantic: data.semantic,
            scales: data.scales || {
                primary: generateColorScale(data.primary)
            }
        }, null, 2);
    }, [data]);

    const generateSCSS = useCallback(() => {
        let scss = "// Primary Colors\n";
        scss += `$primary: ${data.primary};\n`;
        if (data.secondary) scss += `$secondary: ${data.secondary};\n`;
        if (data.accent) scss += `$accent: ${data.accent};\n`;

        scss += "\n// Semantic Colors\n";
        scss += `$success: ${data.semantic.success};\n`;
        scss += `$warning: ${data.semantic.warning};\n`;
        scss += `$danger: ${data.semantic.danger};\n`;
        scss += `$info: ${data.semantic.info};\n`;

        const primaryScale = data.scales?.primary || generateColorScale(data.primary);
        scss += "\n// Primary Scale\n";
        scss += "$primary: (\n";
        Object.entries(primaryScale).forEach(([step, color]) => {
            scss += `  '${step}': ${color},\n`;
        });
        scss += ");\n";

        return scss;
    }, [data]);

    const getCode = useCallback(() => {
        switch (format) {
            case "css": return generateCSS();
            case "tailwind": return generateTailwind();
            case "json": return generateJSON();
            case "scss": return generateSCSS();
        }
    }, [format, generateCSS, generateTailwind, generateJSON, generateSCSS]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(getCode());
        toast.success("Código copiado al portapapeles");
    }, [getCode]);

    const handleDownload = useCallback(() => {
        const extensions = { css: "css", tailwind: "js", json: "json", scss: "scss" };
        const blob = new Blob([getCode()], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `color-palette.${extensions[format]}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Archivo descargado");
    }, [getCode, format]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Exportar Paleta</h3>
                    <p className="text-sm text-zinc-500">Genera código para usar en tus proyectos</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy size={14} className="mr-2" /> Copiar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download size={14} className="mr-2" /> Descargar
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={format === "css" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormat("css")}
                    className={format === "css" ? "" : "bg-zinc-900 border-zinc-700"}
                >
                    CSS Variables
                </Button>
                <Button
                    variant={format === "tailwind" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormat("tailwind")}
                    className={format === "tailwind" ? "" : "bg-zinc-900 border-zinc-700"}
                >
                    Tailwind Config
                </Button>
                <Button
                    variant={format === "scss" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormat("scss")}
                    className={format === "scss" ? "" : "bg-zinc-900 border-zinc-700"}
                >
                    SCSS
                </Button>
                <Button
                    variant={format === "json" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormat("json")}
                    className={format === "json" ? "" : "bg-zinc-900 border-zinc-700"}
                >
                    JSON
                </Button>
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 overflow-hidden">
                <pre className="text-sm text-zinc-300 font-mono overflow-x-auto">
                    <code>{getCode()}</code>
                </pre>
            </div>
        </div>
    );
}

// Preview Panel
interface PreviewPanelProps {
    data: ColorPaletteData;
}

function PreviewPanel({ data }: PreviewPanelProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Vista Previa</h3>
                <Eye size={18} className="text-zinc-500" />
            </div>

            {/* Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Preview */}
                <div className="rounded-xl overflow-hidden border border-zinc-700">
                    <div className="p-6" style={{ backgroundColor: data.primary }}>
                        <h4 className="text-white text-xl font-bold mb-2">Primary Color</h4>
                        <p className="text-white/80 text-sm">
                            Este color se usa para elementos principales y llamadas a la acción.
                        </p>
                    </div>
                    <div className="bg-zinc-950 p-4 flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">{data.primary}</span>
                        <button
                            onClick={() => { navigator.clipboard.writeText(data.primary); toast.success("Copiado"); }}
                            className="text-zinc-500 hover:text-white"
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                {/* Semantic Preview */}
                <div className="rounded-xl overflow-hidden border border-zinc-700">
                    <div className="p-4 space-y-3 bg-zinc-950">
                        {Object.entries(data.semantic).map(([key, color]) => (
                            <div key={key} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-sm font-medium capitalize" style={{ color }}>{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Color Scale Preview */}
            <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-3">Escala Primary</h4>
                <div className="flex h-20 rounded-xl overflow-hidden">
                    {Object.entries(data.scales?.primary || generateColorScale(data.primary)).map(([step, color]) => (
                        <div
                            key={step}
                            className="flex-1 flex items-end justify-center pb-2 group relative hover:flex-[2] transition-all cursor-pointer"
                            style={{ backgroundColor: color }}
                            title={`${step}: ${color}`}
                        >
                            <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: chroma(color).luminance() > 0.5 ? "#000" : "#fff" }}
                            >
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Content component that properly uses hooks at the top level
interface ColorPaletteWorkspaceContentProps {
    data: ColorPaletteModuleData | null;
    saveModule: (data: ColorPaletteModuleData) => Promise<boolean>;
}

interface ColorPaletteModuleData {
    content?: {
        palette?: ColorPaletteData;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

function ColorPaletteWorkspaceContent({ data, saveModule }: ColorPaletteWorkspaceContentProps) {
    const [paletteData, setPaletteData] = useState<ColorPaletteData>(
        data?.content?.palette || defaultPalette
    );
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = useCallback((newData: ColorPaletteData) => {
        setPaletteData(newData);
        setHasChanges(true);
    }, []);

    const handleSave = useCallback(async () => {
        const moduleData: ColorPaletteModuleData = data ?? {};
        await saveModule({
            ...moduleData,
            content: {
                ...(moduleData.content ?? {}),
                palette: paletteData
            }
        });
        setHasChanges(false);
        toast.success("Paleta guardada correctamente");
    }, [data, paletteData, saveModule]);

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Tienes cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                            setPaletteData(data?.content?.palette || defaultPalette);
                            setHasChanges(false);
                        }}>
                            Descartar
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 bg-[#0A0A0A]">
                    <Tabs defaultValue="palette" className="h-full flex flex-col">
                        <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                            <TabsList className="bg-transparent h-12 p-0 gap-6">
                                <TabsTrigger value="palette" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Palette size={14} className="mr-2" /> Paleta
                                </TabsTrigger>
                                <TabsTrigger value="scales" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Layers size={14} className="mr-2" /> Escalas
                                </TabsTrigger>
                                <TabsTrigger value="semantic" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <AlertCircle size={14} className="mr-2" /> Semánticos
                                </TabsTrigger>
                                <TabsTrigger value="contrast" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Sun size={14} className="mr-2" /> Contraste
                                </TabsTrigger>
                                <TabsTrigger value="export" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Download size={14} className="mr-2" /> Exportar
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <TabsContent value="palette" className="m-0 focus:outline-none">
                                    <PaletteEditor data={paletteData} onChange={handleChange} />
                                </TabsContent>

                                <TabsContent value="scales" className="m-0 focus:outline-none">
                                    <ScaleGenerator data={paletteData} onChange={handleChange} />
                                </TabsContent>

                                <TabsContent value="semantic" className="m-0 focus:outline-none">
                                    <SemanticColorsEditor data={paletteData} onChange={handleChange} />
                                </TabsContent>

                                <TabsContent value="contrast" className="m-0 focus:outline-none">
                                    <ContrastChecker data={paletteData} />
                                </TabsContent>

                                <TabsContent value="export" className="m-0 focus:outline-none">
                                    <ExportTab data={paletteData} />
                                </TabsContent>
                            </ScrollArea>
                        </div>
                    </Tabs>
                </div>

                {/* Preview Panel */}
                <div className="w-80 border-l border-zinc-800 bg-[#050505] overflow-y-auto">
                    <PreviewPanel data={paletteData} />
                </div>
            </div>
        </div>
    );
}

// Main Component
export default function ColorPaletteWorkspace({ brandId }: { brandId: string }) {
    const [showAIGenerator, setShowAIGenerator] = useState(false);

    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="colorPalette"
            moduleName="Paleta de Color"
            moduleSubtitle="Define los colores de tu marca, escalas y contrastes"
            backLink={`/dashboard/brands/${brandId}`}
            headerActions={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIGenerator(!showAIGenerator)}
                    className="h-9 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                    <Sparkles size={14} className="mr-2" />
                    Generar con IA
                </Button>
            }
        >
            {(props) => (
                <>
                    {showAIGenerator && (
                        <div className="border-b border-zinc-800 bg-[#050505] p-4">
                            <WorkspaceAIGenerator
                                moduleKey="colorPalette"
                                brandId={brandId}
                                onGenerated={(data) => {
                                    // Procesar datos generados
                                    if (data && typeof data === 'object' && 'content' in data) {
                                        const content = (data as { content?: { palette?: ColorPaletteData } }).content;
                                        if (content?.palette) {
                                            props.saveModule({
                                                ...props.data,
                                                content: { palette: content.palette }
                                            });
                                            toast.success('Paleta generada exitosamente');
                                            setShowAIGenerator(false);
                                        }
                                    }
                                }}
                                onError={(error) => {
                                    toast.error(`Error: ${error}`);
                                }}
                            />
                        </div>
                    )}
                    <ColorPaletteWorkspaceContent {...props} />
                </>
            )}
        </BaseWorkspace>
    );
}
