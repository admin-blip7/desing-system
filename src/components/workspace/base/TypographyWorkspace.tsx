"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { useAIGeneration } from "@/components/workspace/shared/withAIGeneration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Type, List, Eye, Download, Copy, Search, Check, X, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Types
interface FontFamily {
    name: string;
    provider: "google" | "local" | "system";
    url?: string;
    weights: number[];
    styles: string[];
    category?: string; // serif, sans-serif, display, etc.
}

interface TypeScale {
    name: string; // h1, h2, h3, body, caption, etc.
    label: string; // Display name
    size: string; // 48px, 1.5rem, etc.
    weight: number; // 400, 500, 700
    lineHeight: string; // 1.2, 1.5, etc.
    letterSpacing?: string; // -0.02em, normal, etc.
    sample?: string;
}

interface TypographyData {
    fonts: {
        display: FontFamily;
        body: FontFamily;
        mono?: FontFamily;
    };
    scale: {
        base: number; // 16
        ratio: number; // 1.25 (major third)
        steps: TypeScale[];
    };
    hierarchy: {
        h1: TypeScale;
        h2: TypeScale;
        h3: TypeScale;
        h4: TypeScale;
        h5: TypeScale;
        h6: TypeScale;
        body: TypeScale;
        caption: TypeScale;
        small?: TypeScale;
    };
    pairingMatrix?: {
        heading: string;
        body: string;
        rating: "excellent" | "good" | "fair" | "poor";
    }[];
}

// Popular Google Fonts for quick selection
const popularFonts = [
    { name: "Inter", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { name: "Roboto", category: "sans-serif", weights: [100, 300, 400, 500, 700, 900] },
    { name: "Open Sans", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800] },
    { name: "Lato", category: "sans-serif", weights: [100, 300, 400, 700, 900] },
    { name: "Montserrat", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { name: "Poppins", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { name: "Playfair Display", category: "serif", weights: [400, 500, 600, 700, 800, 900] },
    { name: "Merriweather", category: "serif", weights: [300, 400, 700, 900] },
    { name: "Source Serif Pro", category: "serif", weights: [200, 300, 400, 600, 700, 900] },
    { name: "IBM Plex Sans", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700] },
    { name: "IBM Plex Serif", category: "serif", weights: [100, 200, 300, 400, 500, 600, 700] },
    { name: "Space Grotesk", category: "sans-serif", weights: [300, 400, 500, 600, 700] },
    { name: "Space Mono", category: "monospace", weights: [400, 700] },
    { name: "Fira Code", category: "monospace", weights: [300, 400, 500, 600, 700] },
    { name: "Crimson Pro", category: "serif", weights: [200, 300, 400, 500, 600, 700, 800, 900] },
    { name: "DM Sans", category: "sans-serif", weights: [400, 500, 700] },
    { name: "DM Serif Display", category: "serif", weights: [400] },
];

const defaultTypography: TypographyData = {
    fonts: {
        display: { name: "Inter", provider: "google", weights: [700], styles: ["normal"], category: "sans-serif" },
        body: { name: "Inter", provider: "google", weights: [400, 500], styles: ["normal"], category: "sans-serif" },
        mono: { name: "Fira Code", provider: "google", weights: [400], styles: ["normal"], category: "monospace" },
    },
    scale: {
        base: 16,
        ratio: 1.25,
        steps: []
    },
    hierarchy: {
        h1: { name: "h1", label: "Heading 1", size: "48px", weight: 700, lineHeight: "1.2", letterSpacing: "-0.02em" },
        h2: { name: "h2", label: "Heading 2", size: "36px", weight: 600, lineHeight: "1.25", letterSpacing: "-0.01em" },
        h3: { name: "h3", label: "Heading 3", size: "30px", weight: 600, lineHeight: "1.3" },
        h4: { name: "h4", label: "Heading 4", size: "24px", weight: 500, lineHeight: "1.4" },
        h5: { name: "h5", label: "Heading 5", size: "20px", weight: 500, lineHeight: "1.5" },
        h6: { name: "h6", label: "Heading 6", size: "16px", weight: 600, lineHeight: "1.5" },
        body: { name: "body", label: "Body", size: "16px", weight: 400, lineHeight: "1.6" },
        caption: { name: "caption", label: "Caption", size: "12px", weight: 400, lineHeight: "1.5" },
    }
};

// Load Google Font dynamically
function loadGoogleFont(fontName: string, weights: number[] = [400]) {
    const fontId = `google-font-${fontName.replace(/\s+/g, "-")}`;
    if (document.getElementById(fontId)) return;

    const link = document.createElement("link");
    link.id = fontId;
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@${weights.join(";")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

// Font Card Component
interface FontCardProps {
    font: { name: string; category: string; weights: number[] };
    isSelected: boolean;
    onSelect: () => void;
    onPreview?: (name: string) => void;
    setLocalPreview?: (name: string) => void;
}

function FontCard({ font, isSelected, onSelect, onPreview, setLocalPreview }: FontCardProps) {
    useEffect(() => {
        loadGoogleFont(font.name, font.weights.slice(0, 3));
    }, [font.name, font.weights]);

    return (
        <button
            onClick={() => {
                onSelect();
                onPreview?.(font.name);
                setLocalPreview?.(font.name);
            }}
            className={`text-left p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                isSelected
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{font.name}</span>
                {isSelected && <Check size={16} className="text-amber-500" />}
            </div>
            <p className="text-xs text-zinc-500 mb-3 capitalize">{font.category}</p>
            <p
                className="text-sm text-black"
                style={{ fontFamily: font.name }}
            >
                The quick brown fox
            </p>
        </button>
    );
}

// Font Selector with Search
interface FontSelectorProps {
    label: string;
    value: FontFamily;
    onChange: (font: FontFamily) => void;
    onPreview?: (name: string) => void;
}

function FontSelector({ label, value, onChange, onPreview }: FontSelectorProps) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [localPreviewFont, setLocalPreviewFont] = useState<string | null>(null);
    const previewFontName = localPreviewFont || value.name;

    const filteredFonts = useMemo(() => {
        if (!search) return popularFonts;
        return popularFonts.filter(f =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.category.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const handleSelectFont = useCallback((fontName: string, category: string, weights: number[]) => {
        loadGoogleFont(fontName, weights);
        onChange({
            name: fontName,
            provider: "google",
            weights: weights.slice(0, 5),
            styles: ["normal"],
            category
        });
        setIsOpen(false);
    }, [onChange]);

    useEffect(() => {
        if (value.provider === "google") {
            const fontInfo = popularFonts.find(f => f.name === value.name);
            if (fontInfo) {
                loadGoogleFont(value.name, fontInfo.weights);
            }
        }
        // Reset local preview when the selected value changes
        setLocalPreviewFont(null);
    }, [value.name, value.provider]);

    return (
        <div className="space-y-3">
            <Label className="text-sm text-zinc-400">{label}</Label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center">
                        <Type size={18} className="text-zinc-500" />
                    </div>
                    <div>
                        <p className="font-medium text-white">{value.name}</p>
                        <p className="text-xs text-zinc-500 capitalize">{value.provider} • {value.category || ""}</p>
                    </div>
                </div>
                <ArrowUpDown size={16} className="text-zinc-600" />
            </div>

            {isOpen && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar fuentes..."
                            className="pl-10 bg-zinc-950 border-zinc-800"
                        />
                    </div>

                    {/* Font Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {filteredFonts.map(font => (
                            <FontCard
                                key={font.name}
                                font={font}
                                isSelected={value.name === font.name}
                                onSelect={() => handleSelectFont(font.name, font.category, font.weights)}
                                onPreview={onPreview}
                                setLocalPreview={setLocalPreviewFont}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Preview */}
            <div className="bg-white rounded-lg p-4">
                <p className="text-2xl font-medium mb-1 text-black" style={{ fontFamily: previewFontName }}>
                    {previewFontName}
                </p>
                <p className="text-base opacity-80 text-black" style={{ fontFamily: previewFontName }}>
                    The quick brown fox jumps over the lazy dog.
                </p>
            </div>

            {/* Weights selector */}
            {value.provider === "google" && (
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Pesos seleccionados</Label>
                    <div className="flex flex-wrap gap-2">
                        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(weight => (
                            <button
                                key={weight}
                                onClick={() => {
                                    const newWeights = value.weights.includes(weight)
                                        ? value.weights.filter(w => w !== weight)
                                        : [...value.weights, weight];
                                    onChange({ ...value, weights: newWeights });
                                }}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    value.weights.includes(weight)
                                        ? "bg-amber-500 text-black font-medium"
                                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                }`}
                                style={{ fontFamily: value.name, fontWeight: weight }}
                            >
                                {weight}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Hierarchy Editor
interface HierarchyEditorProps {
    hierarchy: TypographyData["hierarchy"];
    fonts: TypographyData["fonts"];
    onChange: (hierarchy: TypographyData["hierarchy"]) => void;
}

function HierarchyEditor({ hierarchy, fonts, onChange }: HierarchyEditorProps) {
    const updateLevel = useCallback((key: keyof typeof hierarchy, updates: Partial<TypeScale>) => {
        onChange({
            ...hierarchy,
            [key]: { ...hierarchy[key], ...updates }
        });
    }, [hierarchy, onChange]);

    const levels: Array<{ key: keyof typeof hierarchy; label: string }> = [
        { key: "h1", label: "Heading 1" },
        { key: "h2", label: "Heading 2" },
        { key: "h3", label: "Heading 3" },
        { key: "h4", label: "Heading 4" },
        { key: "h5", label: "Heading 5" },
        { key: "h6", label: "Heading 6" },
        { key: "body", label: "Body" },
        { key: "caption", label: "Caption" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Jerarquía Tipográfica</h3>
                <p className="text-sm text-zinc-500">Define la escala de tamaños y pesos para cada nivel.</p>
            </div>

            <div className="space-y-4">
                {levels.map(({ key, label }) => {
                    const levelData = hierarchy[key];
                    if (!levelData) return null;

                    return (
                    <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{label}</span>
                            <span className="text-xs text-zinc-500 font-mono">{levelData.name}</span>
                        </div>

                        {/* Live Preview */}
                        <div className="bg-white rounded-lg p-4">
                            <p
                                className="text-black"
                                style={{
                                    fontFamily: key.startsWith("h") ? fonts.display.name : fonts.body.name,
                                    fontSize: levelData.size,
                                    fontWeight: levelData.weight,
                                    lineHeight: levelData.lineHeight,
                                    letterSpacing: levelData.letterSpacing,
                                }}
                            >
                                {label}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">Tamaño</Label>
                                <Input
                                    value={levelData.size}
                                    onChange={e => updateLevel(key, { size: e.target.value })}
                                    className="h-8 bg-zinc-950 border-zinc-800 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">Peso</Label>
                                <select
                                    value={levelData.weight}
                                    onChange={e => updateLevel(key, { weight: parseInt(e.target.value) })}
                                    className="h-8 w-full bg-zinc-950 border border-zinc-800 rounded px-2 text-sm text-white"
                                >
                                    {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">Line Height</Label>
                                <Input
                                    value={levelData.lineHeight}
                                    onChange={e => updateLevel(key, { lineHeight: e.target.value })}
                                    className="h-8 bg-zinc-950 border-zinc-800 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">Letter Spacing</Label>
                                <Input
                                    value={levelData.letterSpacing || "normal"}
                                    onChange={e => updateLevel(key, { letterSpacing: e.target.value })}
                                    className="h-8 bg-zinc-950 border-zinc-800 text-sm"
                                    placeholder="normal"
                                />
                            </div>
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
    );
}

// Type Scale Builder
interface ScaleBuilderProps {
    scale: TypographyData["scale"];
    onChange: (scale: TypographyData["scale"]) => void;
}

function ScaleBuilder({ scale, onChange }: ScaleBuilderProps) {
    const generateScale = useCallback(() => {
        const steps: TypeScale[] = [];
        const ratios = {
            "Minor Second": 1.067,
            "Major Second": 1.125,
            "Minor Third": 1.2,
            "Major Third": 1.25,
            "Perfect Fourth": 1.333,
            "Augmented Fourth": 1.414,
            "Perfect Fifth": 1.5,
            "Golden Ratio": 1.618
        };

        for (let i = -3; i <= 4; i++) {
            const size = scale.base * Math.pow(scale.ratio, i);
            steps.push({
                name: i === 0 ? "base" : i < 0 ? `-${Math.abs(i)}` : `+${i}`,
                label: `${size.toFixed(1)}px`,
                size: `${size.toFixed(1)}px`,
                weight: 400,
                lineHeight: "1.5"
            });
        }

        return steps;
    }, [scale]);

    const generatedSteps = useMemo(() => generateScale(), [generateScale]);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Type Scale Builder</h3>
                <p className="text-sm text-zinc-500">Genera una escala modular basada en una razón matemática.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Tamaño Base (px)</Label>
                    <Input
                        type="number"
                        value={scale.base}
                        onChange={e => onChange({ ...scale, base: parseInt(e.target.value) || 16 })}
                        className="bg-zinc-900 border-zinc-800"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Razón</Label>
                    <select
                        value={scale.ratio}
                        onChange={e => onChange({ ...scale, ratio: parseFloat(e.target.value) })}
                        className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded px-3 text-white"
                    >
                        <option value={1.067}>Minor Second (1.067)</option>
                        <option value={1.125}>Major Second (1.125)</option>
                        <option value={1.2}>Minor Third (1.2)</option>
                        <option value={1.25}>Major Third (1.25)</option>
                        <option value={1.333}>Perfect Fourth (1.333)</option>
                        <option value={1.414}>Augmented Fourth (1.414)</option>
                        <option value={1.5}>Perfect Fifth (1.5)</option>
                        <option value={1.618}>Golden Ratio (1.618)</option>
                    </select>
                </div>
            </div>

            {/* Generated Scale Preview */}
            <div className="bg-zinc-900 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-medium text-zinc-400">Escala Generada</h4>
                {generatedSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <span className="w-16 text-xs text-zinc-500 font-mono">{step.name}</span>
                        <div className="flex-1 h-12 bg-white rounded flex items-center px-4">
                            <span className="text-black" style={{ fontSize: step.size }}>
                                Ag
                            </span>
                        </div>
                        <span className="w-16 text-xs text-zinc-400 font-mono">{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Font Pairing Matrix
function PairingMatrix({ data }: { data: TypographyData }) {
    const combinations = useMemo(() => {
        const headings = popularFonts.filter(f => f.category === "serif" || f.category === "sans-serif").slice(0, 4);
        const bodies = popularFonts.filter(f => f.category === "sans-serif").slice(0, 4);

        return headings.map(h => ({
            heading: h.name,
            body: bodies.find(b => b.name !== h.name)?.name || "Inter",
            rating: (h.category === "serif" ? "excellent" : "good") as "excellent" | "good" | "fair" | "poor"
        }));
    }, []);

    const ratingColors = {
        excellent: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        good: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        fair: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        poor: "bg-red-500/20 text-red-400 border-red-500/30"
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Matriz de Combinaciones</h3>
                <p className="text-sm text-zinc-500">Sugerencias de pairing para headings y body.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {combinations.map((combo, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">
                                <span className="font-medium text-white">{combo.heading}</span> + <span className="font-medium text-white">{combo.body}</span>
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${ratingColors[combo.rating]}`}>
                                {combo.rating}
                            </span>
                        </div>
                        <div className="bg-white rounded-lg p-4 space-y-2">
                            <p className="text-xl font-bold text-black" style={{ fontFamily: combo.heading }}>
                                {combo.heading}
                            </p>
                            <p className="text-sm text-black" style={{ fontFamily: combo.body }}>
                                The quick brown fox jumps over the lazy dog. This pairing works well because...
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Preview Panel
interface PreviewPanelProps {
    data: TypographyData;
}

function PreviewPanel({ data }: PreviewPanelProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Vista Previa</h3>
                <Eye size={18} className="text-zinc-500" />
            </div>

            {/* Sample Article */}
            <div className="bg-white rounded-xl p-6 space-y-4">
                <h1 className="text-black" style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h1 }}>
                    Título Principal H1
                </h1>
                <h2 className="text-black" style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h2 }}>
                    Subtítulo H2
                </h2>
                <h3 className="text-black" style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h3 }}>
                    Tercer nivel H3
                </h3>
                <p className="text-black" style={{ fontFamily: data.fonts.body.name, ...data.hierarchy.body }}>
                    Este es un párrafo de texto que muestra cómo se ve la tipografía del cuerpo. The quick brown fox jumps over the lazy dog. La combinación de una tipografía deDisplay strong con una tipografía de body legible crea una jerarquía visual clara.
                </p>
                <p className="text-black" style={{ fontFamily: data.fonts.body.name, ...data.hierarchy.caption }}>
                    Este es un texto de caption o pie de foto, normalmente más pequeño y sutil.
                </p>
                {data.fonts.mono && (
                    <code style={{ fontFamily: data.fonts.mono.name, fontSize: "14px" }} className="block bg-zinc-100 p-2 rounded">
                        const mono = "Monospace text for code";
                    </code>
                )}
            </div>

            {/* All Headings */}
            <div className="bg-zinc-950 rounded-xl p-4 space-y-3">
                <h4 className="text-xs text-zinc-500 uppercase tracking-wider">All Headings</h4>
                <div className="space-y-2">
                    <h1 style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h1 }} className="text-white">
                        Heading 1
                    </h1>
                    <h2 style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h2 }} className="text-white">
                        Heading 2
                    </h2>
                    <h3 style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h3 }} className="text-white">
                        Heading 3
                    </h3>
                    <h4 style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h4 }} className="text-white">
                        Heading 4
                    </h4>
                    <h5 style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h5 }} className="text-white">
                        Heading 5
                    </h5>
                    <h6 style={{ fontFamily: data.fonts.display.name, ...data.hierarchy.h6 }} className="text-white">
                        Heading 6
                    </h6>
                </div>
            </div>
        </div>
    );
}

// Export Tab
interface ExportTabProps {
    data: TypographyData;
}

function ExportTab({ data }: ExportTabProps) {
    const [format, setFormat] = useState<"css" | "tailwind" | "json">("css");

    const generateCSS = useCallback(() => {
        let css = "/* Typography */\n\n";

        // Font imports
        if (data.fonts.display.provider === "google") {
            css += `@import url('https://fonts.googleapis.com/css2?family=${data.fonts.display.name.replace(/\s+/g, "+")}:wght@${data.fonts.display.weights.join(";")}&display=swap');\n`;
        }
        if (data.fonts.body.provider === "google" && data.fonts.body.name !== data.fonts.display.name) {
            css += `@import url('https://fonts.googleapis.com/css2?family=${data.fonts.body.name.replace(/\s+/g, "+")}:wght@${data.fonts.body.weights.join(";")}&display=swap');\n`;
        }
        css += "\n";

        // CSS Variables
        css += ":root {\n";
        css += `  --font-display: '${data.fonts.display.name}', ${data.fonts.display.category || "sans-serif"};\n`;
        css += `  --font-body: '${data.fonts.body.name}', ${data.fonts.body.category || "sans-serif"};\n`;
        if (data.fonts.mono) {
            css += `  --font-mono: '${data.fonts.mono.name}', ${data.fonts.mono.category || "monospace"};\n`;
        }

        Object.entries(data.hierarchy).forEach(([key, value]) => {
            css += `  --${key}-size: ${value.size};\n`;
            css += `  --${key}-weight: ${value.weight};\n`;
            css += `  --${key}-line-height: ${value.lineHeight};\n`;
            if (value.letterSpacing) {
                css += `  --${key}-letter-spacing: ${value.letterSpacing};\n`;
            }
        });
        css += "}\n";

        // Utility classes
        css += "\n/* Typography Classes */\n";
        Object.entries(data.hierarchy).forEach(([key, value]) => {
            css += `.${key} {\n`;
            css += `  font-family: var(--font-${key.startsWith("h") ? "display" : "body"});\n`;
            css += `  font-size: var(--${key}-size);\n`;
            css += `  font-weight: var(--${key}-weight);\n`;
            css += `  line-height: var(--${key}-line-height);\n`;
            if (value.letterSpacing) {
                css += `  letter-spacing: var(--${key}-letter-spacing);\n`;
            }
            css += "}\n";
        });

        return css;
    }, [data]);

    const generateTailwind = useCallback(() => {
        const tw = {
            theme: {
                extend: {
                    fontFamily: {
                        display: [data.fonts.display.name, data.fonts.display.category || "sans-serif"],
                        sans: [data.fonts.body.name, data.fonts.body.category || "sans-serif"],
                        ...(data.fonts.mono && { mono: [data.fonts.mono.name, data.fonts.mono.category || "monospace"] }),
                    },
                    fontSize: {}
                }
            }
        };

        const fontSizeObj = tw.theme.extend.fontSize as Record<string, any>;
        Object.entries(data.hierarchy).forEach(([key, value]) => {
            fontSizeObj[key] = [
                value.size.replace("px", "rem"),
                {
                    fontWeight: value.weight,
                    lineHeight: value.lineHeight,
                    ...(value.letterSpacing && { letterSpacing: value.letterSpacing })
                }
            ];
        });

        return JSON.stringify(tw, null, 2);
    }, [data]);

    const generateJSON = useCallback(() => {
        return JSON.stringify(data, null, 2);
    }, [data]);

    const getCode = useCallback(() => {
        switch (format) {
            case "css": return generateCSS();
            case "tailwind": return generateTailwind();
            case "json": return generateJSON();
        }
    }, [format, generateCSS, generateTailwind, generateJSON]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(getCode());
        toast.success("Código copiado al portapapeles");
    }, [getCode]);

    const handleDownload = useCallback(() => {
        const extensions = { css: "css", tailwind: "js", json: "json" };
        const blob = new Blob([getCode()], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `typography.${extensions[format]}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Archivo descargado");
    }, [getCode, format]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Exportar Tipografía</h3>
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
                    CSS
                </Button>
                <Button
                    variant={format === "tailwind" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormat("tailwind")}
                    className={format === "tailwind" ? "" : "bg-zinc-900 border-zinc-700"}
                >
                    Tailwind
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

// Content component with hooks - must be a separate component to follow React hooks rules
interface TypographyWorkspaceContentProps {
    data: unknown;
    saveModule: (data: unknown) => Promise<boolean>;
}

function extractTypographyFromModuleData(input: unknown): TypographyData {
    const asRecord = (value: unknown): Record<string, unknown> | null => (
        value && typeof value === "object" ? (value as Record<string, unknown>) : null
    );

    const root = asRecord(input);
    const content = asRecord(root?.content);
    const candidates: unknown[] = [
        root?.typography,
        content?.typography,
        content,
        root,
    ];

    for (const candidate of candidates) {
        if (
            candidate &&
            typeof candidate === "object" &&
            candidate.fonts &&
            candidate.hierarchy &&
            candidate.scale
        ) {
            return candidate as TypographyData;
        }
    }

    return defaultTypography;
}

function TypographyWorkspaceContent({ data, saveModule }: TypographyWorkspaceContentProps) {
    const [typographyData, setTypographyData] = useState<TypographyData>(
        extractTypographyFromModuleData(data)
    );
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setTypographyData(extractTypographyFromModuleData(data));
    }, [data]);

    const handleChange = useCallback((newData: TypographyData) => {
        setTypographyData(newData);
        setHasChanges(true);
    }, []);

    const handleSave = useCallback(async () => {
        const success = await saveModule({
            ...((data && typeof data === "object") ? data : {}),
            typography: typographyData,
        });

        if (!success) {
            toast.error("No se pudo guardar la tipografía.");
            return;
        }

        setHasChanges(false);
        toast.success("Tipografía guardada correctamente");
    }, [data, typographyData, saveModule]);

    return (
        <div className="h-full flex flex-col min-h-0">
            {hasChanges && (
                <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
                    <span className="text-amber-400 text-sm">Tienes cambios sin guardar</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                            setTypographyData(extractTypographyFromModuleData(data));
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
                    <Tabs defaultValue="fonts" className="h-full flex flex-col">
                        <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                            <TabsList className="bg-transparent h-12 p-0 gap-6">
                                <TabsTrigger value="fonts" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Type size={14} className="mr-2" /> Fuentes
                                </TabsTrigger>
                                <TabsTrigger value="hierarchy" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <List size={14} className="mr-2" /> Jerarquía
                                </TabsTrigger>
                                <TabsTrigger value="scale" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <ArrowUpDown size={14} className="mr-2" /> Escala
                                </TabsTrigger>
                                <TabsTrigger value="pairing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Type size={14} className="mr-2" /> Combinaciones
                                </TabsTrigger>
                                <TabsTrigger value="export" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                                    <Download size={14} className="mr-2" /> Exportar
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <TabsContent value="fonts" className="m-0 focus:outline-none">
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Selección de Fuentes</h3>
                                            <p className="text-sm text-zinc-500">Elige las fuentes para headings, body y código.</p>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <FontSelector
                                                label="Display / Headings"
                                                value={typographyData.fonts.display}
                                                onChange={(font) => handleChange({
                                                    ...typographyData,
                                                    fonts: { ...typographyData.fonts, display: font }
                                                })}
                                            />
                                            <FontSelector
                                                label="Body Text"
                                                value={typographyData.fonts.body}
                                                onChange={(font) => handleChange({
                                                    ...typographyData,
                                                    fonts: { ...typographyData.fonts, body: font }
                                                })}
                                            />
                                            <FontSelector
                                                label="Monospace (Opcional)"
                                                value={typographyData.fonts.mono || { name: "Fira Code", provider: "google", weights: [400], styles: ["normal"], category: "monospace" }}
                                                onChange={(font) => handleChange({
                                                    ...typographyData,
                                                    fonts: { ...typographyData.fonts, mono: font }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="hierarchy" className="m-0 focus:outline-none">
                                    <HierarchyEditor
                                        hierarchy={typographyData.hierarchy}
                                        fonts={typographyData.fonts}
                                        onChange={(hierarchy) => handleChange({ ...typographyData, hierarchy })}
                                    />
                                </TabsContent>

                                <TabsContent value="scale" className="m-0 focus:outline-none">
                                    <ScaleBuilder
                                        scale={typographyData.scale}
                                        onChange={(scale) => handleChange({ ...typographyData, scale })}
                                    />
                                </TabsContent>

                                <TabsContent value="pairing" className="m-0 focus:outline-none">
                                    <PairingMatrix data={typographyData} />
                                </TabsContent>

                                <TabsContent value="export" className="m-0 focus:outline-none">
                                    <ExportTab data={typographyData} />
                                </TabsContent>
                            </ScrollArea>
                        </div>
                    </Tabs>
                </div>

                {/* Preview Panel */}
                <div className="w-96 border-l border-zinc-800 bg-[#050505] overflow-y-auto">
                    <PreviewPanel data={typographyData} />
                </div>
            </div>
        </div>
    );
}

// Main Component
export default function TypographyWorkspace({ brandId }: { brandId: string }) {
    const { headerActions, aiPanel } = useAIGeneration(
        brandId,
        "typography",
        (data) => {
            // Procesar datos generados por IA
            console.log("Typography data generated:", data);
            toast.success("Tipografía generada exitosamente");
        }
    );

    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="typography"
            moduleName="Tipografía"
            moduleSubtitle="Define las fuentes, escalas y jerarquías tipográficas"
            backLink={`/dashboard/brands/${brandId}`}
            headerActions={headerActions}
        >
            {(props) => (
                <>
                    {aiPanel}
                    <TypographyWorkspaceContent {...props} />
                </>
            )}
        </BaseWorkspace>
    );
}
