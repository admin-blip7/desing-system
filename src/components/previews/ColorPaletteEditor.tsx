"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ColorSwatch {
    name: string;
    hex: string;
    usage: string;
}

interface PaletteSection {
    [key: string]: ColorSwatch | string; // Handle simple hex or object
}

interface ColorPalette {
    primary?: ColorSwatch | string;
    secondary?: ColorSwatch | string;
    accent?: ColorSwatch | string;
    neutrals?: Record<string, string>;
    [key: string]: any;
}

interface ColorPaletteEditorProps {
    content: string; // JSON string
    onChange?: (newContent: string) => void;
}

export default function ColorPaletteEditor({ content, onChange }: ColorPaletteEditorProps) {
    const [palette, setPalette] = useState<ColorPalette>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const parsed = JSON.parse(content);
            setPalette(parsed);
            setError(null);
        } catch (e) {
            setError("Invalid JSON format for color palette");
            console.error(e);
        }
    }, [content]);

    const updateColor = (path: string[], hex: string) => {
        const newPalette = { ...palette };
        let current: any = newPalette;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }

        // Handle if it's a direct hex string or an object with hex property
        const lastKey = path[path.length - 1];
        if (typeof current[lastKey] === 'string') {
            current[lastKey] = hex;
        } else if (current[lastKey] && typeof current[lastKey] === 'object') {
            current[lastKey].hex = hex;
        }

        setPalette(newPalette);
        onChange?.(JSON.stringify(newPalette, null, 2));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Hex copiado");
    };

    if (error) return <div className="text-red-500 p-4">{error}</div>;

    const renderColorSwatch = (color: ColorSwatch | string | undefined, label: string, path: string[]) => {
        if (!color) return null;
        const hex = typeof color === 'string' ? color : color.hex;
        const name = typeof color === 'string' ? label : color.name;
        const usage = typeof color === 'string' ? '' : color.usage;

        return (
            <div key={label} className="flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {name && <span className="text-xs text-zinc-500">{name}</span>}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(hex)}
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>

                <div className="relative h-24 rounded-md shadow-inner border border-zinc-700 overflow-hidden group">
                    <div
                        className="absolute inset-0"
                        style={{ backgroundColor: hex }}
                    />
                    <input
                        type="color"
                        value={hex}
                        onChange={(e) => updateColor(path, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs text-zinc-400 font-mono flex-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        {hex}
                    </div>
                    <Input
                        className="h-7 w-20 text-xs font-mono bg-zinc-950 border-zinc-800"
                        value={hex}
                        onChange={(e) => updateColor(path, e.target.value)}
                    />
                </div>

                {usage && <p className="text-xs text-zinc-500 mt-2 italic">{usage}</p>}
            </div>
        );
    };

    return (
        <div className="space-y-8 p-4">
            {/* Primary Colors */}
            <section>
                <h3 className="text-lg font-medium text-white mb-4">Core Palette</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderColorSwatch(palette.primary, "primary", ["primary"])}
                    {renderColorSwatch(palette.secondary, "secondary", ["secondary"])}
                    {renderColorSwatch(palette.accent, "accent", ["accent"])}
                </div>
            </section>

            {/* Neutrals */}
            {palette.neutrals && (
                <section>
                    <h3 className="text-lg font-medium text-white mb-4">Neutrals</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {Object.entries(palette.neutrals).map(([key, value]) => (
                            <div key={key} className="flex flex-col gap-1">
                                <div
                                    className="h-12 w-full rounded border border-zinc-700 relative overflow-hidden group"
                                    style={{ backgroundColor: value as string }}
                                >
                                    <input
                                        type="color"
                                        value={value as string}
                                        onChange={(e) => updateColor(['neutrals', key], e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                </div>
                                <span className="text-xs text-zinc-500 font-mono text-center">{key}</span>
                                <span className="text-xs text-zinc-600 font-mono text-center">{value as string}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Preview Section */}
            <section className="bg-white rounded-xl p-8 mt-8 border border-zinc-800">
                <h3 className="text-black font-bold text-2xl mb-2" style={{ color: (palette.primary as any)?.hex || '#000' }}>Preview UI</h3>
                <p className="text-zinc-600 mb-6 max-w-md">This is how your colors might look applied to a real interface element.</p>

                <div className="flex gap-4">
                    <button className="px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: (palette.primary as any)?.hex || '#000' }}>
                        Primary Button
                    </button>
                    <button className="px-6 py-3 rounded-lg font-medium border-2 transition-colors hover:bg-gray-50"
                        style={{
                            borderColor: (palette.primary as any)?.hex || '#000',
                            color: (palette.primary as any)?.hex || '#000'
                        }}
                    >
                        Secondary Button
                    </button>
                    <button className="px-6 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: (palette.accent as any)?.hex || '#000' }}>
                        Accent Action
                    </button>
                </div>
            </section>
        </div>
    );
}
