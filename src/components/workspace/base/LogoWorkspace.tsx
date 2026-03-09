"use client";

import React, { useState } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { useAIGeneration } from "@/components/workspace/shared/withAIGeneration";
import { BrandTokens } from "@/lib/design-tokens/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Box, Shield, Maximize, Ban, CheckCircle, X, Download, Palette, Copy, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoUpload } from "@/lib/hooks/useLogoUpload";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "sonner";
import chroma from "chroma-js";
import { LogoGenerator } from "@/components/workspace/base/LogoGenerator";
import QuickLogoGenerator from "@/components/workspace/base/QuickLogoGenerator";

// ============================================================================
// LOGO UPLOAD SECTION
// ============================================================================

interface LogoUploadSectionProps {
    title: string;
    value?: string;
    onChange: (url: string) => void;
    brandId: string;
    path: string;
}

function LogoUploadSection({ title, value, onChange, brandId, path }: LogoUploadSectionProps) {
    const { uploadLogo, isUploading } = useLogoUpload(brandId);

    const handleFileSelect = async (file: File) => {
        const url = await uploadLogo(file, path);
        if (url) {
            onChange(url);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-400">{title}</h4>
            {value ? (
                <div className="relative group border border-zinc-800 rounded-lg p-8 bg-zinc-900/50 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt={title} className="max-h-32 max-w-full object-contain" />
                    <button
                        onClick={() => onChange("")}
                        className="absolute top-2 right-2 p-1 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <FileUploader
                    onFileSelect={handleFileSelect}
                    isLoading={isUploading}
                    label={`Subir ${title}`}
                />
            )}
        </div>
    );
}

// ============================================================================
// CLEAR SPACE EDITOR (Interactive)
// ============================================================================

interface ClearSpaceEditorProps {
    value: number; // percentage (0-100)
    onChange: (value: number) => void;
}

function ClearSpaceEditor({ value, onChange }: ClearSpaceEditorProps) {
    const backgroundColors = [
        { name: 'White', value: '#FFFFFF' },
        { name: 'Black', value: '#000000' },
        { name: 'Light Gray', value: '#E5E5E5' },
        { name: 'Dark Gray', value: '#1A1A1A' },
        { name: 'Brand Color', value: '#F5C518' },
        { name: 'Red', value: '#EF4444' },
        { name: 'Blue', value: '#3B82F6' },
    ];

    const [selectedBg, setSelectedBg] = useState(backgroundColors[0].value);
    const logoSize = 80; // px

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Área de Protección</h3>
                <button
                    onClick={() => {
                        const css = `.logo-clear-space { padding: ${value}%; }`;
                        navigator.clipboard.writeText(css);
                        toast.success('CSS copied!');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
                >
                    <Copy size={14} /> Copy CSS
                </button>
            </div>

            {/* Interactive Clear Space Visualizer */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
                <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                        backgroundColor: selectedBg,
                        padding: `${value}%`,
                        borderRadius: '8px',
                        minHeight: '200px'
                    }}
                >
                    <div
                        className="relative bg-white text-black font-bold p-4"
                        style={{
                            width: logoSize,
                            height: logoSize * 0.6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px'
                        }}
                    >
                        LOGO
                        {/* Clear space markers */}
                        <div className="absolute -top-2 left-0 w-full h-2 border border-dashed border-blue-400/70 flex items-center justify-center text-[10px] text-blue-400">
                            {value}%
                        </div>
                        <div className="absolute -bottom-2 left-0 w-full h-2 border border-dashed border-blue-400/70 flex items-center justify-center text-[10px] text-blue-400">
                            {value}%
                        </div>
                    </div>
                </div>

                {/* Clear space measurements */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-500">
                    <div>Top: {value}%</div>
                    <div>Bottom: {value}%</div>
                    <div>Left: {value}%</div>
                    <div>Right: {value}%</div>
                </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-400 uppercase">Área de protección</label>
                    <span className="text-sm text-zinc-300 font-mono">{value}% del ancho</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Background Tester */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-400">Probar en diferentes fondos</h4>
                <div className="grid grid-cols-4 gap-2">
                    {backgroundColors.map((bg) => (
                        <button
                            key={bg.value}
                            onClick={() => setSelectedBg(bg.value)}
                            className={`
                                aspect-square rounded-lg border-2 transition-all
                                ${selectedBg === bg.value ? 'border-amber-500 scale-105' : 'border-zinc-700 hover:border-zinc-600'}
                            `}
                            style={{ backgroundColor: bg.value }}
                            title={bg.name}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Fondo actual:</span>
                    <span className="font-mono">{selectedBg}</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MIN SIZE CALCULATOR
// ============================================================================

interface MinSizeCalculatorProps {
    logoUrl?: string;
    values: {
        print: number;      // mm
        screen: number;     // px
        favicon: number;    // px
    };
    onChange: (values: MinSizeCalculatorProps['values']) => void;
}

function MinSizeCalculator({ logoUrl, values, onChange }: MinSizeCalculatorProps) {
    const printPx = values.print * 3.78; // Approx conversion mm to px at 96dpi

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-white mb-4">Tamaños Mínimos</h3>

            <div className="space-y-4">
                {/* Print Size */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Impreso (mm)</label>
                        <input
                            type="number"
                            value={values.print}
                            onChange={(e) => onChange({ ...values, print: parseFloat(e.target.value) })}
                            className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 text-center"
                            min="5"
                            max="100"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>≈ {printPx}px en pantalla</span>
                        {logoUrl && (
                            <div
                                className="ml-auto border border-zinc-700"
                                style={{ width: `${Math.min(printPx, 100)}px` }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={logoUrl} alt="" className="max-w-full max-h-full" style={{ maxHeight: '20px' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Screen Size */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Pantalla (px)</label>
                        <input
                            type="number"
                            value={values.screen}
                            onChange={(e) => onChange({ ...values, screen: parseFloat(e.target.value) })}
                            className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 text-center"
                            min="16"
                            max="500"
                        />
                    </div>
                    <div className="text-xs text-zinc-500">
                        {values.screen}px de ancho mínimo
                    </div>
                </div>

                {/* Favicon Size */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Favicon (px)</label>
                        <input
                            type="number"
                            value={values.favicon}
                            onChange={(e) => onChange({ ...values, favicon: parseFloat(e.target.value) })}
                            className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 text-center"
                            min="16"
                            max="64"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>32x32</span>
                        <span>•</span>
                        <span>16x16</span>
                        <span>•</span>
                        <span>{values.favicon}x{values.favicon} (actual)</span>
                    </div>
                </div>
            </div>

            {/* Size Reference Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Tabla de Referencia</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-700">
                                <th className="text-left py-2 text-zinc-400">Aplicación</th>
                                <th className="text-left py-2 text-zinc-400">Tamaño mínimo</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-300">
                            <tr className="border-b border-zinc-800">
                                <td className="py-2">Business card</td>
                                <td className="py-2">{values.print}mm / {Math.round(values.print * 3.78)}px</td>
                            </tr>
                            <tr className="border-b border-zinc-800">
                                <td className="py-2">Letterhead</td>
                                <td className="py-2">{Math.round(values.print * 1.5)}mm / {Math.round(values.print * 1.5 * 3.78)}px</td>
                            </tr>
                            <tr className="border-b border-zinc-800">
                                <td className="py-2">Web header</td>
                                <td className="py-2">{values.screen}px</td>
                            </tr>
                            <tr>
                                <td className="py-2">Favicon</td>
                                <td className="py-2">{values.favicon}px</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// USAGE GALLERY (DO/DON'T)
// ============================================================================

interface UsageExample {
    id: string;
    title: string;
    imageUrl: string;
    isCorrect: boolean;
    description: string;
}

interface UsageGalleryProps {
    logoUrl?: string;
    examples: UsageExample[];
    onAdd: () => void;
}

function UsageGallery({ logoUrl, examples, onAdd }: UsageGalleryProps) {
    return (
        <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-white mb-4">Usos Correctos e Incorrectos</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Correct Examples */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-green-500 flex items-center gap-2">
                        <CheckCircle size={16} /> Usos Correctos
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                        {examples.filter(e => e.isCorrect).map((example) => (
                            <div
                                key={example.id}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-xs font-medium text-white">{example.title}</span>
                                    <button
                                        onClick={() => {/* Implement delete */}}
                                        className="text-zinc-500 hover:text-red-400 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                <div className="aspect-video bg-zinc-800 rounded flex items-center justify-center">
                                    {example.imageUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={example.imageUrl} alt={example.title} className="max-w-full max-h-full object-contain" />
                                    ) : logoUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={logoUrl} alt={example.title} className="max-h-full max-w-full object-contain" style={{ maxHeight: '60px' }} />
                                    ) : (
                                        <span className="text-zinc-600 text-xs">Ejemplo</span>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400">{example.description}</p>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onAdd}
                            className="w-full border-dashed"
                        >
                            + Agregar Ejemplo Correcto
                        </Button>
                    </div>
                </div>

                {/* Incorrect Examples */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-red-500 flex items-center gap-2">
                        <Ban size={16} /> Usos Incorrectos
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                        {examples.filter(e => !e.isCorrect).map((example) => (
                            <div
                                key={example.id}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-xs font-medium text-white">{example.title}</span>
                                    <button
                                        onClick={() => {/* Implement delete */}}
                                        className="text-zinc-500 hover:text-red-400 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                <div className="aspect-video bg-zinc-800 rounded flex items-center justify-center relative overflow-hidden">
                                    {example.imageUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={example.imageUrl} alt={example.title} className="max-w-full max-h-full object-contain opacity-50" />
                                    ) : logoUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={logoUrl} alt={example.title} className="max-h-full max-w-full object-contain opacity-50" style={{ maxHeight: '60px' }} />
                                    ) : (
                                        <span className="text-zinc-600 text-xs">Ejemplo</span>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="px-2 py-1 bg-red-500/20 rounded text-red-400 text-xs font-bold">
                                            ✕
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-400">{example.description}</p>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onAdd}
                            className="w-full border-dashed"
                        >
                            + Agregar Ejemplo Incorrecto
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// BACKGROUND TESTER
// ============================================================================

interface BackgroundTesterProps {
    logoUrl?: string;
    onAddAllowed: (color: string) => void;
    onAddProhibited: (color: string) => void;
    allowedColors: string[];
    prohibitedColors: string[];
}

function BackgroundTester({ logoUrl, onAddAllowed, onAddProhibited, allowedColors, prohibitedColors }: BackgroundTesterProps) {
    const [testBg, setTestBg] = useState('#FFFFFF');
    const presetColors = [
        { name: 'White', value: '#FFFFFF' },
        { name: 'Black', value: '#000000' },
        { name: 'Light Gray', value: '#E5E5E5' },
        { name: 'Dark Gray', value: '#1A1A1A' },
        { name: 'Brand Color', value: '#F5C518' },
        { name: 'Red', value: '#EF4444' },
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Green', value: '#10B981' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Orange', value: '#F97316' },
    ];

    const getContrastStatus = (bgColor: string, logoUrl?: string) => {
        if (!logoUrl) return 'unknown';
        // This would be calculated based on actual logo, for now using simple heuristic
        try {
            const brightness = chroma(bgColor).luminance();
            if (brightness > 0.5 && bgColor === '#FFFFFF') return 'good';
            if (brightness < 0.2 && bgColor === '#000000') return 'good';
            return 'check-manual';
        } catch {
            return 'unknown';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-white mb-4">Probador de Fondos</h3>

            {/* Test Area */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 space-y-4">
                <div
                    className="flex items-center justify-center h-48 rounded-lg transition-colors"
                    style={{ backgroundColor: testBg }}
                >
                    {logoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={logoUrl} alt="Logo" className="max-h-24 max-w-full object-contain" />
                    ) : (
                        <span className="text-zinc-500">Sube un logo primero</span>
                    )}
                </div>

                {/* Contrast Status */}
                <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-zinc-400">Contraste:</span>
                    <span
                        className={`font-medium ${
                            getContrastStatus(testBg, logoUrl) === 'good' ? 'text-green-400' :
                            'text-zinc-400'
                        }`}
                    >
                        {getContrastStatus(testBg, logoUrl) === 'good' ? '✓ Aprobado' :
                            'Verificar manualmente'}
                    </span>
                </div>
            </div>

            {/* Quick Color Selection */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-400">Colores de prueba</h4>
                <div className="grid grid-cols-5 gap-2">
                    {presetColors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setTestBg(color.value)}
                            className={`
                                aspect-square rounded-lg border-2 transition-all
                                ${testBg === color.value ? 'border-amber-500 scale-105' : 'border-zinc-700 hover:border-zinc-600'}
                            `}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>

            {/* Color Input */}
            <div className="flex items-center gap-3">
                <label className="text-sm text-zinc-400">Color personalizado:</label>
                <input
                    type="color"
                    value={testBg}
                    onChange={(e) => setTestBg(e.target.value)}
                    className="w-12 h-8 rounded cursor-pointer"
                />
                <input
                    type="text"
                    value={testBg}
                    onChange={(e) => setTestBg(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-1 text-sm text-zinc-300 font-mono"
                />
            </div>

            {/* Allowed/Prohibited Lists */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-green-500 uppercase tracking-wider">Fondos Permitidos</h4>
                    <div className="space-y-1">
                        {allowedColors.map((color, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between bg-zinc-800 rounded px-2 py-1"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-zinc-300 font-mono">{color}</span>
                                </div>
                                <button
                                    onClick={() => {/* Remove from allowed */}}
                                    className="text-zinc-500 hover:text-red-400 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            onAddAllowed(testBg);
                        }}
                        className="w-full text-xs text-green-400 border border-dashed border-green-800 hover:bg-green-900/20 rounded px-2 py-1 transition-colors"
                    >
                        + Agregar actual
                    </button>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider">Fondos Prohibidos</h4>
                    <div className="space-y-1">
                        {prohibitedColors.map((color, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between bg-zinc-800 rounded px-2 py-1"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-zinc-300 font-mono">{color}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        // Remove from prohibited
                                    }}
                                    className="text-zinc-500 hover:text-red-400 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            onAddProhibited(testBg);
                        }}
                        className="w-full text-xs text-red-400 border border-dashed border-red-900 hover:bg-red-900/20 rounded px-2 py-1 transition-colors"
                    >
                        + Agregar actual
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// EXPORT SPEC SHEET
// ============================================================================

function ExportSpecSheet({ content, brandId }: { content: LogoData; brandId: string }) {
    const [isExporting, setIsExporting] = useState(false);

    const generatePDF = () => {
        // This would generate a PDF using jsPDF or similar
        const spec = `
====================================
ESPECIFICACIONES DEL LOGOTIPO
====================================

Versiones:
- Principal: ${content.versions?.primary || 'No definido'}
- Secundaria: ${content.versions?.secondary || 'No definido'}
- Monocromático: ${content.versions?.monochrome || 'No definido'}
- Ícono: ${content.versions?.icon || 'No definido'}

Área de Protección:
- Valor X: ${content.clearSpace}%
- Área mínima alrededor: ${content.clearSpace}% del ancho del logo

Tamaños Mínimos:
- Impreso: ${content.minSizes?.print || 'N/A'} mm
- Pantalla: ${content.minSizes?.screen || 'N/A'} px
- Favicon: ${content.minSizes?.favicon || 'N/A'} px

Generado por Brand Manual App
Fecha: ${new Date().toLocaleDateString()}
        `;
        return spec;
    };

    const handleExportPdf = async () => {
        try {
            setIsExporting(true);
            const response = await fetch("/api/export/logo-guidelines/pdf", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ brandId }),
            });

            if (!response.ok) {
                throw new Error("No fue posible exportar el PDF.");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${brandId}-logo-guidelines.pdf`;
            anchor.click();
            URL.revokeObjectURL(url);
            toast.success("PDF exportado correctamente.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al exportar PDF.";
            toast.error(message);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-white mb-4">Especificaciones Técnicas</h3>

            <div className="space-y-4">
                {/* Summary */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Resumen</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-zinc-500">Versiones:</span>
                            <span className="ml-2 text-zinc-300">{Object.keys(content.versions || {}).length}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500">Área de protección:</span>
                            <span className="ml-2 text-zinc-300">{content.clearSpace}%</span>
                        </div>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const spec = generatePDF();
                            navigator.clipboard.writeText(spec);
                            toast.success('Especificaciones copiadas!');
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
                    >
                        <Copy size={14} /> Copiar Texto
                    </button>
                    <button
                        onClick={() => {
                            void handleExportPdf();
                        }}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-500 hover:bg-amber-600 rounded text-black font-medium transition-colors disabled:opacity-60"
                    >
                        <Download size={14} /> {isExporting ? "Exportando..." : "Exportar PDF"}
                    </button>
                </div>

                {/* CSS Variables */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Variables CSS</h4>
                    <code className="block text-xs text-zinc-400 font-mono whitespace-pre-wrap">
{`:root {
  --logo-primary: url('${content.versions?.primary || ''}');
  --logo-secondary: url('${content.versions?.secondary || ''}');
  --logo-icon: url('${content.versions?.icon || ''}');
  --logo-clear-space: ${content.clearSpace}%;
}`}
                    </code>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface LogoData {
    versions: {
        primary: string;
        secondary?: string;
        monochrome?: string;
        icon?: string;
    };
    clearSpace: number;
    minSizes: {
        print: number;
        screen: number;
        favicon: number;
    };
    allowedBackgrounds: string[];
    prohibitedBackgrounds: string[];
    usageExamples: Array<{
        id: string;
        title: string;
        imageUrl: string;
        isCorrect: boolean;
        description: string;
    }>;
}

interface LogoWorkspaceModuleData {
    brandName?: string;
    content?: LogoData;
}

const DEFAULT_LOGO_DATA: LogoData = {
    versions: { primary: "", secondary: "", icon: "" },
    clearSpace: 50,
    minSizes: { print: 20, screen: 120, favicon: 32 },
    allowedBackgrounds: ['#FFFFFF', '#000000', '#F5C518'],
    prohibitedBackgrounds: [],
    usageExamples: []
};

function resolveInitialLogoData(content?: LogoData): LogoData {
    if (!content) {
        return {
            ...DEFAULT_LOGO_DATA,
            versions: { ...DEFAULT_LOGO_DATA.versions },
            minSizes: { ...DEFAULT_LOGO_DATA.minSizes },
            allowedBackgrounds: [...DEFAULT_LOGO_DATA.allowedBackgrounds],
            prohibitedBackgrounds: [...DEFAULT_LOGO_DATA.prohibitedBackgrounds],
            usageExamples: [...DEFAULT_LOGO_DATA.usageExamples],
        };
    }

    return {
        ...DEFAULT_LOGO_DATA,
        ...content,
        versions: {
            ...DEFAULT_LOGO_DATA.versions,
            ...content.versions,
        },
        minSizes: {
            ...DEFAULT_LOGO_DATA.minSizes,
            ...content.minSizes,
        },
        allowedBackgrounds: content.allowedBackgrounds ?? DEFAULT_LOGO_DATA.allowedBackgrounds,
        prohibitedBackgrounds: content.prohibitedBackgrounds ?? DEFAULT_LOGO_DATA.prohibitedBackgrounds,
        usageExamples: content.usageExamples ?? DEFAULT_LOGO_DATA.usageExamples,
    };
}

function extractLogoDataFromUnknown(value: unknown, depth = 0): LogoData | undefined {
    if (!value || typeof value !== "object" || depth > 6) return undefined;
    const record = value as Record<string, unknown>;

    if (record.versions && typeof record.versions === "object" && record.minSizes && typeof record.minSizes === "object") {
        return record as unknown as LogoData;
    }

    if (record.content && typeof record.content === "object") {
        return extractLogoDataFromUnknown(record.content, depth + 1);
    }

    return undefined;
}

function normalizeHexList(values: string[]): string[] {
    const seen = new Set<string>();
    const normalized: string[] = [];

    for (const value of values) {
        const trimmed = value.trim().toUpperCase();
        const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
        if (!/^#[0-9A-F]{6}$/.test(withHash)) continue;
        if (seen.has(withHash)) continue;
        seen.add(withHash);
        normalized.push(withHash);
    }

    return normalized;
}

function toUsageExamples(
    examples: Array<{ title: string; isCorrect: boolean; description: string }>,
): LogoData["usageExamples"] {
    return examples.map((example, index) => ({
        id: `ai-${Date.now()}-${index}`,
        title: example.title,
        imageUrl: "",
        isCorrect: example.isCorrect,
        description: example.description,
    }));
}

function sanitizeLogoVersionsForPersistence(versions: LogoData["versions"]): LogoData["versions"] {
    const MAX_DATA_URL_LENGTH = 250000;
    const keys: Array<keyof LogoData["versions"]> = ["primary", "secondary", "monochrome", "icon"];
    const sanitized = { ...versions };

    for (const key of keys) {
        const value = sanitized[key];
        if (!value) continue;
        const isDataUrl = value.startsWith("data:image/");
        if (isDataUrl && value.length > MAX_DATA_URL_LENGTH) {
            sanitized[key] = "";
        }
    }

    return sanitized;
}

// Inner component that handles state management
function LogoWorkspaceContent({
    data,
    saveModule,
    brandId,
    brandTokens
}: {
    data: LogoWorkspaceModuleData | null;
    saveModule: (content: LogoData) => Promise<boolean>;
    brandId: string;
    brandTokens?: BrandTokens;
}) {
    const [content, setContent] = useState<LogoData>(() => {
        const extracted = extractLogoDataFromUnknown(data);
        return resolveInitialLogoData(extracted);
    });

    const hasLogo = !!content.versions.primary;

    const safeBrandName = data?.brandName || '';

    const updateContent = (newContent: LogoData) => {
        setContent(newContent);
        void saveModule(newContent);
    };

    const updateVersion = (key: keyof LogoData['versions'], url: string) => {
        updateContent({
            ...content,
            versions: { ...content.versions, [key]: url }
        });
    };

    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="generate" className="h-full flex flex-col">
                <div className="border-b border-zinc-800 px-6 bg-[#050505]">
                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                        <TabsTrigger value="generate" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Wand2 size={14} className="mr-2" /> Generación de Logo
                        </TabsTrigger>
                        <TabsTrigger value="versions" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Box size={14} className="mr-2" /> Versiones
                        </TabsTrigger>
                        <TabsTrigger value="clearspace" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Shield size={14} className="mr-2" /> Área de Protección
                        </TabsTrigger>
                        <TabsTrigger value="minsize" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Maximize size={14} className="mr-2" /> Tamaños Mínimos
                        </TabsTrigger>
                        <TabsTrigger value="backgrounds" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Palette size={14} className="mr-2" /> Fondos
                        </TabsTrigger>
                        <TabsTrigger value="usage" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <CheckCircle size={14} className="mr-2" /> Usos
                        </TabsTrigger>
                        <TabsTrigger value="export" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                            <Download size={14} className="mr-2" /> Exportar
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 bg-[#0A0A0A]">
                        <ScrollArea className="h-full">
                            <TabsContent value="generate" className="m-0 p-0 min-h-full">
                                <Tabs defaultValue="quick" className="h-full flex flex-col">
                                    <div className="border-b border-zinc-800 bg-[#050505] px-6 py-4">
                                        <h3 className="text-sm font-medium text-white">Generación de Logo</h3>
                                        <p className="mt-1 text-xs text-zinc-400">
                                            Usa el flujo rápido para generar en segundos o abre el editor avanzado para ajustes detallados.
                                        </p>
                                        <TabsList className="mt-3 bg-zinc-900/70">
                                            <TabsTrigger value="quick" className="text-zinc-300 data-[state=active]:text-white">
                                                Flujo rápido
                                            </TabsTrigger>
                                            <TabsTrigger value="advanced" className="text-zinc-300 data-[state=active]:text-white">
                                                Editor avanzado
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="quick" className="m-0 p-6">
                                        <div className="mx-auto max-w-3xl">
                                            <QuickLogoGenerator
                                                onGenerate={async (_payload, result) => {
                                                    const generatedGuidelines = result.guidelines;
                                                    const generatedVariants = result.variants;
                                                    const nextContent: LogoData = {
                                                        ...content,
                                                        versions: sanitizeLogoVersionsForPersistence({
                                                            ...content.versions,
                                                            primary: generatedVariants?.primary || result.imageSrc,
                                                            secondary: generatedVariants?.secondary || content.versions.secondary || result.imageSrc,
                                                            monochrome: generatedVariants?.monochrome || content.versions.monochrome || "",
                                                            icon: generatedVariants?.icon || content.versions.icon || "",
                                                        }),
                                                        clearSpace: generatedGuidelines?.clearSpace ?? content.clearSpace,
                                                        minSizes: generatedGuidelines?.minSizes ?? content.minSizes,
                                                        allowedBackgrounds: generatedGuidelines
                                                            ? normalizeHexList(generatedGuidelines.allowedBackgrounds)
                                                            : content.allowedBackgrounds,
                                                        prohibitedBackgrounds: generatedGuidelines
                                                            ? normalizeHexList(generatedGuidelines.prohibitedBackgrounds)
                                                            : content.prohibitedBackgrounds,
                                                        usageExamples:
                                                            generatedGuidelines && generatedGuidelines.usageExamples.length > 0
                                                                ? toUsageExamples(generatedGuidelines.usageExamples)
                                                                : content.usageExamples,
                                                    };

                                                    updateContent(nextContent);
                                                    toast.success("Flujo completado: versiones, reglas y especificaciones autogeneradas.");

                                                    if (!nextContent.versions.primary) {
                                                        toast.warning("La imagen principal generada fue demasiado pesada para persistencia directa. Usa 'Subir versión principal' para guardar un archivo optimizado.");
                                                    }
                                                }}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="advanced" className="m-0 min-h-full">
                                        {brandTokens ? (
                                            <LogoGenerator
                                                brandId={brandId}
                                                brandTokens={brandTokens}
                                                brandName={safeBrandName}
                                                onSave={async (primaryUrl, secondaryUrl) => {
                                                    updateContent({
                                                        ...content,
                                                        versions: {
                                                            ...content.versions,
                                                            primary: primaryUrl,
                                                            secondary: secondaryUrl
                                                        }
                                                    });
                                                    return true;
                                                }}
                                                existingData={content}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                                        <Wand2 size={24} className="text-zinc-600" />
                                                    </div>
                                                    <p className="text-sm text-zinc-400">Cargando tokens de marca...</p>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </TabsContent>

                            <TabsContent value="versions" className="m-0 p-6 min-h-full">
                                <h3 className="text-lg font-medium text-white mb-6">Versiones del Logotipo</h3>
                                <p className="text-sm text-zinc-400 mb-6">
                                    Sube las diferentes versiones de tu logotipo. La versión principal se usará en la mayoría de aplicaciones.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <LogoUploadSection
                                        title="Versión Principal (Obligatorio)"
                                        value={content.versions.primary}
                                        onChange={(url) => updateVersion('primary', url)}
                                        brandId={brandId}
                                        path="primary"
                                    />
                                    <LogoUploadSection
                                        title="Versión Secundaria / Negativo"
                                        value={content.versions.secondary}
                                        onChange={(url) => updateVersion('secondary', url)}
                                        brandId={brandId}
                                        path="secondary"
                                    />
                                    <LogoUploadSection
                                        title="Versión Monocromática"
                                        value={content.versions.monochrome}
                                        onChange={(url) => updateVersion('monochrome', url)}
                                        brandId={brandId}
                                        path="monochrome"
                                    />
                                    <LogoUploadSection
                                        title="Ícono / Symbolo"
                                        value={content.versions.icon}
                                        onChange={(url) => updateVersion('icon', url)}
                                        brandId={brandId}
                                        path="icon"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="clearspace" className="m-0">
                                <ClearSpaceEditor
                                    value={content.clearSpace}
                                    onChange={(value) => updateContent({ ...content, clearSpace: value })}
                                />
                            </TabsContent>

                            <TabsContent value="minsize" className="m-0">
                                <MinSizeCalculator
                                    logoUrl={content.versions.primary}
                                    values={content.minSizes}
                                    onChange={(values) => updateContent({ ...content, minSizes: values })}
                                />
                            </TabsContent>

                            <TabsContent value="backgrounds" className="m-0">
                                <BackgroundTester
                                    logoUrl={content.versions.primary}
                                    onAddAllowed={(color) => updateContent({
                                        ...content,
                                        allowedBackgrounds: [...content.allowedBackgrounds, color]
                                    })}
                                    onAddProhibited={(color) => updateContent({
                                        ...content,
                                        prohibitedBackgrounds: [...content.prohibitedBackgrounds, color]
                                    })}
                                    allowedColors={content.allowedBackgrounds}
                                    prohibitedColors={content.prohibitedBackgrounds}
                                />
                            </TabsContent>

                            <TabsContent value="usage" className="m-0">
                                <UsageGallery
                                    logoUrl={content.versions.primary}
                                    examples={content.usageExamples}
                                    onAdd={() => {/* Add example dialog */}}
                                />
                            </TabsContent>

                            <TabsContent value="export" className="m-0">
                                <ExportSpecSheet content={content} brandId={brandId} />
                            </TabsContent>
                        </ScrollArea>
                    </div>

                    {/* Preview Panel */}
                    <div className="w-[400px] border-l border-zinc-800 bg-[#050505] hidden lg:block">
                        <div className="p-4 border-b border-zinc-800">
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Vista Previa</h3>
                        </div>
                        <div className="p-6 flex items-center justify-center h-full">
                            {hasLogo ? (
                                <div className="space-y-6 text-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={content.versions.primary}
                                        alt="Logo preview"
                                        className="max-h-32 mx-auto"
                                    />
                                    <div className="space-y-2 text-xs text-zinc-400">
                                        <p>Versión primaria</p>
                                        <p className="font-mono">{content.versions.primary}</p>
                                    </div>
                                    <div
                                        className="inline-block p-4 rounded-lg border-2 border-dashed border-zinc-600"
                                        style={{
                                            backgroundColor: "#FFFFFF",
                                            padding: `${content.clearSpace}%`,
                                        }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={content.versions.primary}
                                            alt="Logo with clear space"
                                            className="max-h-16"
                                        />
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Área de protección: {content.clearSpace}%
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center">
                                        <Box size={24} className="text-zinc-600" />
                                    </div>
                                    <p className="text-sm text-zinc-400">Sube tu logo para ver la vista previa</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}

// Main component that uses BaseWorkspace
export default function LogoWorkspace({ brandId }: { brandId: string }) {
    const { headerActions, aiPanel } = useAIGeneration(
        brandId,
        "logo",
        (data) => {
            console.log("Logo data generated:", data);
            toast.success("Logo generado exitosamente");
        }
    );

    return (
        <BaseWorkspace
            brandId={brandId}
            moduleKey="logo"
            moduleName="Logotipo"
            moduleSubtitle="Gestiona las versiones y reglas de uso de tu logo"
            backLink={`/dashboard/brands/${brandId}`}
            headerActions={headerActions}
        >
            {({ data, saveModule, brandTokens }) => (
                <>
                    {aiPanel}
                    <LogoWorkspaceContent
                        data={data}
                        saveModule={saveModule}
                        brandId={brandId}
                        brandTokens={brandTokens}
                    />
                </>
            )}
        </BaseWorkspace>
    );
}
