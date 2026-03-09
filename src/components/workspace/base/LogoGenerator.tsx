"use client";

import React, { useState, useEffect, useRef } from "react";
import { BrandTokens } from "@/lib/design-tokens/types";
import { toast } from "sonner";
import {
  Wand2,
  Download,
  Save,
  RefreshCw,
  Eye,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  iconTemplates,
  templateDescriptions,
  type IconTemplateType,
  FullLogo
} from "@/lib/logo-generator/templates";
import {
  exportToPNG,
  exportToSVG,
  downloadDataUrl,
  uploadPNGToStorage
} from "@/lib/logo-generator/export";

type GenerateLogoInput = {
  typography: "Serif" | "Sans-serif" | "Modern" | "Script" | "Bold" | "Light";
  tone: "Professional" | "Playful" | "Luxury" | "Minimalist" | "Bold" | "Elegant" | "Tech" | "Organic";
  iconStyle: "abstract" | "geometric" | "typographic" | "symbolic" | "badge";
};

interface LogoGeneratorProps {
  brandId: string;
  brandTokens: BrandTokens;
  brandName?: string;
  onSave: (primaryUrl: string, secondaryUrl: string) => Promise<boolean>;
  existingData?: any;
}

// Color presets from brand tokens
const getBrandColors = (tokens: BrandTokens) => ({
  primary: tokens.color.accent, // Use accent as the primary brand color
  secondary: tokens.color.accentMuted, // Use accentMuted as secondary
  accent: tokens.color.accentContrast, // Use accentContrast for additional variation
  text: tokens.color.textPrimary,
  background: tokens.color.background,
});

// Template options with icons
const templateOptions: { type: IconTemplateType; icon: LucideIcon; name: string }[] = [
  { type: 'circle', icon: Wand2, name: 'Círculo' },
  { type: 'square', icon: Wand2, name: 'Cuadrado' },
  { type: 'diamond', icon: Wand2, name: 'Diamante' },
  { type: 'boldLetter', icon: Wand2, name: 'Letra Bold' },
  { type: 'outlineLetter', icon: Wand2, name: 'Letra Outline' },
  { type: 'hexagonBadge', icon: Wand2, name: 'Hexágono' },
  { type: 'shieldBadge', icon: Wand2, name: 'Escudo' },
  { type: 'splitHorizontal', icon: Wand2, name: 'Split H' },
  { type: 'splitVertical', icon: Wand2, name: 'Split V' },
  { type: 'quartered', icon: Wand2, name: 'Cuartos' },
];

export function LogoGenerator({
  brandId,
  brandTokens,
  brandName: initialBrandName = '',
  onSave,
  existingData
}: LogoGeneratorProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // State
  const [brandName, setBrandName] = useState(initialBrandName);
  const [tagline, setTagline] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<IconTemplateType>('square');
  const [layout, setLayout] = useState<'horizontal' | 'stacked'>('horizontal');
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('dark');
  const [fontSize, setFontSize] = useState(32);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold' | '900'>('bold');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textTransform, setTextTransform] = useState<'none' | 'uppercase' | 'lowercase'>('none');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // AI Generation state
  const [generationMode, setGenerationMode] = useState<'template' | 'ai'>('template');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedImageUrl, setAiGeneratedImageUrl] = useState<string | null>(null);
  const [aiTypography, setAiTypography] = useState<GenerateLogoInput['typography']>('Modern');
  const [aiTone, setAiTone] = useState<GenerateLogoInput['tone']>('Professional');
  const [aiIconStyle, setAiIconStyle] = useState<GenerateLogoInput['iconStyle']>('geometric');
  const [aiIndustry, setAiIndustry] = useState<string>('');

  // Get brand colors from tokens
  const brandColors = getBrandColors(brandTokens);

  // Get initials from brand name
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 0) return 'BM';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return words.map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const initials = getInitials(brandName);

  // Export handlers
  const handleDownloadPNG = async () => {
    if (!svgRef.current) return;
    setIsExporting(true);
    try {
      const pngUrl = await exportToPNG(svgRef.current, 3);
      const filename = `${brandName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
      downloadDataUrl(pngUrl, filename);
      toast.success('PNG descargado exitosamente');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      toast.error('Error al exportar PNG');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    try {
      const svgString = exportToSVG(svgRef.current);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const filename = `${brandName.replace(/\s+/g, '-').toLowerCase()}-logo.svg`;
      downloadDataUrl(url, filename);
      URL.revokeObjectURL(url);
      toast.success('SVG descargado exitosamente');
    } catch (error) {
      console.error('Error exporting SVG:', error);
      toast.error('Error al exportar SVG');
    }
  };

  const handleSaveAsPrimary = async () => {
    if (!svgRef.current) return;
    setIsSaving(true);
    try {
      // Generate PNG for primary
      const pngUrl = await exportToPNG(svgRef.current, 3);
      const uploadedPngUrl = await uploadPNGToStorage(pngUrl, brandId, 'primary');

      // Generate SVG for secondary
      const svgString = exportToSVG(svgRef.current);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const svgDataUrl = URL.createObjectURL(svgBlob);

      // For SVG, we'll store as data URL since Supabase might not serve SVG correctly
      // In production, you might want to upload as .svg file
      const success = await onSave(
        uploadedPngUrl || pngUrl,
        svgDataUrl
      );

      if (success) {
        toast.success('Logo guardado como versión principal');
      }
    } catch (error) {
      console.error('Error saving logo:', error);
      toast.error('Error al guardar el logo');
    } finally {
      setIsSaving(false);
    }
  };

  // Render the selected icon template
  const IconTemplate = iconTemplates[selectedTemplate];

  // AI Generation handler - uses API route instead of Server Action
  const handleAIGenerate = async () => {
    if (!brandName) {
      toast.error('Por favor ingresa el nombre de tu marca');
      return;
    }

    setIsGenerating(true);
    setAiGeneratedImageUrl(null);

    try {
      const input = {
        brandName,
        primaryColor: brandColors.primary,
        secondaryColor: brandColors.secondary,
        typography: aiTypography,
        tone: aiTone,
        iconStyle: aiIconStyle,
        layout,
        industry: aiIndustry || undefined
      };

      console.log('[LogoGenerator] Calling API route with input:', input);

      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const result = await response.json();
      console.log('[LogoGenerator] API response:', result);

      if (result.success) {
        if (result.base64) {
          setAiGeneratedImageUrl(result.base64);
          toast.success('Logo generado exitosamente con IA');
        } else if (result.imageUrl) {
          setAiGeneratedImageUrl(result.imageUrl);
          toast.success('Logo generado exitosamente con IA');
        }
      } else {
        // Handle different error types
        if (result.errorType === 'validation') {
          toast.error(result.error || 'Por favor verifica los datos ingresados');
        } else if (result.errorType === 'unauthorized') {
          toast.error('Error de configuración del servicio. Contacta a soporte.');
        } else if (result.errorType === 'api') {
          toast.error(result.error || 'Error en el servicio de generación. Intenta nuevamente.');
        } else {
          toast.error(result.error || 'Error al generar el logo');
        }
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      toast.error('Error al generar el logo. Intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save AI generated logo
  const handleSaveAIGenerated = async () => {
    if (!aiGeneratedImageUrl || !onSave) return;

    setIsSaving(true);
    try {
      // Convert base64 to blob if needed
      let primaryUrl = aiGeneratedImageUrl;
      let secondaryUrl = aiGeneratedImageUrl;

      // If it's a base64 data URL, we might want to upload it to storage
      if (aiGeneratedImageUrl.startsWith('data:')) {
        const uploadedUrl = await uploadPNGToStorage(aiGeneratedImageUrl, brandId, 'ai-generated');
        if (uploadedUrl) {
          primaryUrl = uploadedUrl;
          secondaryUrl = uploadedUrl;
        }
      }

      await onSave(primaryUrl, secondaryUrl);
      toast.success('Logo guardado como versión principal');
    } catch (error) {
      console.error('Error saving AI logo:', error);
      toast.error('Error al guardar el logo');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="flex-1 bg-[#0A0A0A] border-r border-zinc-800">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Brand Identity */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Identidad de Marca
                </h3>

                {/* Brand Name Input */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Nombre de la marca</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Tu marca"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Tagline Input */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Eslogan (opcional)</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Tu eslogan aquí"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Generation Mode Toggle */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Modo de Generación
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGenerationMode('template')}
                    className={`
                      p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                      ${generationMode === 'template'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }
                    `}
                  >
                    <Wand2 size={20} className={generationMode === 'template' ? 'text-amber-500' : 'text-zinc-500'} />
                    <span className="text-sm text-zinc-300">Plantillas SVG</span>
                    <span className="text-xs text-zinc-500">Instantáneo</span>
                  </button>

                  <button
                    onClick={() => setGenerationMode('ai')}
                    className={`
                      p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                      ${generationMode === 'ai'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }
                    `}
                  >
                    <Sparkles size={20} className={generationMode === 'ai' ? 'text-purple-500' : 'text-zinc-500'} />
                    <span className="text-sm text-zinc-300">Generación con IA</span>
                    <span className="text-xs text-zinc-500">deapi.ai</span>
                  </button>
                </div>
              </div>

              {/* AI Generation Controls */}
              {generationMode === 'ai' && (
                <div className="space-y-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <h4 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    Configuración de IA
                  </h4>

                  {/* Typography Style */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Estilo de Tipografía</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Serif', 'Sans-serif', 'Modern', 'Script', 'Bold', 'Light'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => setAiTypography(style)}
                          className={`
                            px-2 py-1.5 rounded text-xs capitalize transition-all
                            ${aiTypography === style
                              ? 'bg-purple-500 text-white font-medium'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }
                          `}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Tono del Logo</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Professional', 'Playful', 'Luxury', 'Minimalist', 'Bold', 'Elegant', 'Tech', 'Organic'] as const).map((tone) => (
                        <button
                          key={tone}
                          onClick={() => setAiTone(tone)}
                          className={`
                            px-2 py-1.5 rounded text-xs capitalize transition-all
                            ${aiTone === tone
                              ? 'bg-purple-500 text-white font-medium'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }
                          `}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon Style */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Estilo del Ícono</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['abstract', 'geometric', 'typographic', 'symbolic', 'badge'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => setAiIconStyle(style)}
                          className={`
                            px-2 py-1.5 rounded text-xs capitalize transition-all
                            ${aiIconStyle === style
                              ? 'bg-purple-500 text-white font-medium'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }
                          `}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Industry (Optional) */}
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Industria (opcional)</label>
                    <input
                      type="text"
                      value={aiIndustry}
                      onChange={(e) => setAiIndustry(e.target.value)}
                      placeholder="Ej: Tecnología, Restaurant, Retail..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleAIGenerate}
                    disabled={!brandName || isGenerating}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Generando con IA...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="mr-2" />
                        Generar Logo con IA
                      </>
                    )}
                  </Button>

                  {/* Generation Info */}
                  <p className="text-xs text-zinc-500 text-center">
                    La generación con IA puede tomar 10-30 segundos
                  </p>
                </div>
              )}

              {/* Template Selection - Only show in template mode */}
              {generationMode === 'template' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Estilo del Ícono
                </h3>

                <div className="grid grid-cols-5 gap-2">
                  {templateOptions.map(({ type, name }) => (
                    <button
                      key={type}
                      onClick={() => setSelectedTemplate(type)}
                      className={`
                        aspect-square rounded-lg border-2 transition-all p-2 flex items-center justify-center
                        ${selectedTemplate === type
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                        }
                      `}
                      title={templateDescriptions[type]}
                    >
                      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <IconTemplate
                          initials={initials}
                          primaryColor={selectedTemplate === type ? brandColors.primary : '#404040'}
                          secondaryColor={brandColors.secondary}
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 text-center">
                  {templateDescriptions[selectedTemplate]}
                </p>
              </div>
              )}

              {/* Layout Selection - Hide in AI mode (layout is sent to AI) */}
              {generationMode === 'template' && (
                <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Diseño
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLayout('horizontal')}
                    className={`
                      p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                      ${layout === 'horizontal'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-zinc-600" />
                      <div className="w-16 h-3 rounded bg-zinc-700" />
                    </div>
                    <span className="text-xs text-zinc-400">Horizontal</span>
                  </button>

                  <button
                    onClick={() => setLayout('stacked')}
                    className={`
                      p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                      ${layout === 'stacked'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded bg-zinc-600" />
                      <div className="w-16 h-3 rounded bg-zinc-700" />
                    </div>
                    <span className="text-xs text-zinc-400">Apilado</span>
                  </button>
                </div>
              </div>
              )}

              {/* Typography Controls - Only in template mode */}
              {generationMode === 'template' && (
                <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Tipografía
                </h3>

                {/* Font Weight */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Peso de fuente</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['normal', 'bold', '900'] as const).map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setFontWeight(weight)}
                        className={`
                          px-3 py-2 rounded text-sm capitalize transition-all
                          ${fontWeight === weight
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                          }
                        `}
                        style={{ fontWeight: weight as any }}
                      >
                        {weight === '900' ? 'Black' : weight}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Transform */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Transformación</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'uppercase', 'lowercase'] as const).map((transform) => (
                      <button
                        key={transform}
                        onClick={() => setTextTransform(transform)}
                        className={`
                          px-3 py-2 rounded text-sm capitalize transition-all
                          ${textTransform === transform
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                          }
                        `}
                      >
                        {transform === 'none' ? 'Normal' : transform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Letter Spacing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-500">Espaciado</label>
                    <span className="text-xs text-zinc-400 font-mono">{letterSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
              )}

              {/* Color Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Colores de Marca
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <div
                      className="w-full aspect-square rounded-lg border-2 border-zinc-800"
                      style={{ backgroundColor: brandColors.primary }}
                    />
                    <p className="text-xs text-zinc-500 text-center font-mono">{brandColors.primary}</p>
                  </div>
                  <div className="space-y-1">
                    <div
                      className="w-full aspect-square rounded-lg border-2 border-zinc-800"
                      style={{ backgroundColor: brandColors.secondary }}
                    />
                    <p className="text-xs text-zinc-500 text-center font-mono">{brandColors.secondary}</p>
                  </div>
                  <div className="space-y-1">
                    <div
                      className="w-full aspect-square rounded-lg border-2 border-zinc-800"
                      style={{ backgroundColor: brandColors.accent }}
                    />
                    <p className="text-xs text-zinc-500 text-center font-mono">{brandColors.accent}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-[450px] bg-[#050505] flex flex-col">
          {/* Preview Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Eye size={14} />
              Vista Previa
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode('dark')}
                className={`
                  w-6 h-6 rounded transition-all
                  ${previewMode === 'dark' ? 'ring-2 ring-amber-500' : 'ring-1 ring-zinc-700'}
                `}
                style={{ backgroundColor: '#0A0A0A' }}
              />
              <button
                onClick={() => setPreviewMode('light')}
                className={`
                  w-6 h-6 rounded transition-all
                  ${previewMode === 'light' ? 'ring-2 ring-amber-500' : 'ring-1 ring-zinc-700'}
                `}
                style={{ backgroundColor: '#FFFFFF' }}
              />
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div
              className={`
                p-8 rounded-2xl transition-all
                ${previewMode === 'dark' ? 'bg-zinc-900' : 'bg-white border border-zinc-200'}
              `}
            >
              {/* AI Generated Image Preview */}
              {generationMode === 'ai' && aiGeneratedImageUrl ? (
                <div className="text-center">
                  <img
                    src={aiGeneratedImageUrl}
                    alt={`${brandName} logo generated by AI`}
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-xs text-zinc-500 mt-4">
                    Logo generado con IA usando {brandColors.primary} y {brandColors.secondary}
                  </p>
                </div>
              ) : brandName ? (
                <div>
                  {generationMode === 'template' ? (
                    <FullLogo
                      brandName={brandName}
                      initials={initials}
                      primaryColor={brandColors.primary}
                      secondaryColor={brandColors.secondary}
                      layout={layout}
                      tagline={tagline}
                      fontWeight={fontWeight}
                      letterSpacing={letterSpacing}
                      textTransform={textTransform}
                      size={layout === 'horizontal' ? 300 : 250}
                      svgRef={svgRef}
                    />
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center">
                        <Sparkles size={32} className="text-purple-500" />
                      </div>
                      <p className="text-sm text-zinc-400">
                        Configura las opciones y genera tu logo con IA
                      </p>
                      <p className="text-xs text-zinc-500">
                        Tu logo usará los colores {brandColors.primary} y {brandColors.secondary}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center">
                    <Wand2 size={32} className="text-zinc-600" />
                  </div>
                  <p className="text-sm text-zinc-500">
                    Ingresa el nombre de tu marca para ver la vista previa
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Size Previews */}
          <div className="p-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 mb-3">Tamaños de referencia</p>
            <div className="flex items-center justify-around">
              {/* Favicon size */}
              <div className="text-center">
                <div
                  className={`
                    inline-flex items-center justify-center rounded mb-1
                    ${previewMode === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'}
                  `}
                  style={{ width: 32, height: 32 }}
                >
                  <svg width="16" height="16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <IconTemplate
                      initials={initials}
                      primaryColor={brandColors.primary}
                      secondaryColor={brandColors.secondary}
                    />
                  </svg>
                </div>
                <p className="text-[10px] text-zinc-600">32px</p>
              </div>

              {/* Small size */}
              <div className="text-center">
                <div
                  className={`
                    inline-flex items-center justify-center rounded mb-1
                    ${previewMode === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'}
                  `}
                  style={{ width: 48, height: 48 }}
                >
                  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <IconTemplate
                      initials={initials}
                      primaryColor={brandColors.primary}
                      secondaryColor={brandColors.secondary}
                    />
                  </svg>
                </div>
                <p className="text-[10px] text-zinc-600">48px</p>
              </div>

              {/* Medium size */}
              <div className="text-center">
                <div
                  className={`
                    inline-flex items-center justify-center rounded mb-1
                    ${previewMode === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'}
                  `}
                  style={{ width: 64, height: 64 }}
                >
                  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <IconTemplate
                      initials={initials}
                      primaryColor={brandColors.primary}
                      secondaryColor={brandColors.secondary}
                    />
                  </svg>
                </div>
                <p className="text-[10px] text-zinc-600">64px</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-zinc-800 space-y-2">
            {/* AI Mode Save Button */}
            {generationMode === 'ai' ? (
              <Button
                onClick={handleSaveAIGenerated}
                disabled={!aiGeneratedImageUrl || isSaving}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Guardar Logo IA
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSaveAsPrimary}
                disabled={!brandName || isSaving}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Guardar como Principal
                  </>
                )}
              </Button>
            )}

            {/* Download buttons - Only in template mode */}
            {generationMode === 'template' && (
              <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleDownloadPNG}
                disabled={!brandName || isExporting}
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800 text-white"
              >
                <Download size={16} className="mr-2" />
                PNG
              </Button>
              <Button
                onClick={handleDownloadSVG}
                disabled={!brandName || isExporting}
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800 text-white"
              >
                <Download size={16} className="mr-2" />
                SVG
              </Button>
            </div>
            )}

            {/* Download AI generated image */}
            {generationMode === 'ai' && aiGeneratedImageUrl && (
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = aiGeneratedImageUrl;
                  link.download = `${brandName.replace(/\s+/g, '-').toLowerCase()}-ai-logo.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success('Imagen descargada');
                }}
                variant="outline"
                className="w-full border-zinc-700 hover:bg-zinc-800 text-white"
              >
                <Download size={16} className="mr-2" />
                Descargar Imagen
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
