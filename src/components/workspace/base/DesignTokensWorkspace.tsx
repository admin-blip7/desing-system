"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BaseWorkspace } from "@/components/workspace/shared/BaseWorkspace";
import { BrandTokens } from "@/lib/design-tokens/types";
import { WorkspaceContentProps } from "@/lib/workspace/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette, Type, Move, Sliders, Box, Layers, Download, Eye, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import chroma from "chroma-js";
import { useBrandTokens } from "@/lib/hooks/useBrandTokens";

// ============================================================================
// COLOR EDITOR
// ============================================================================

interface ColorEditorProps {
  tokens: BrandTokens['color'];
  onChange: (val: BrandTokens['color']) => void;
}

function ColorEditor({ tokens, onChange }: ColorEditorProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedToken(key);
    toast.success(`Copied: ${key}`);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colorGroups = [
    { label: 'Core Colors', keys: ['background', 'surface', 'surfaceMuted'] },
    { label: 'Text Colors', keys: ['textPrimary', 'textSecondary', 'textTertiary'] },
    { label: 'Accent Colors', keys: ['accent', 'accentMuted', 'accentContrast'] },
    { label: 'UI Colors', keys: ['border', 'borderStrong', 'focus'] },
    { label: 'Semantic Colors', keys: ['success', 'warning', 'danger'] },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Color Tokens</h3>
        <button
          onClick={() => {
            const cssVars = Object.entries(tokens).map(([key, value]) => `  --bm-color-${key}: ${value};`).join('\n');
            navigator.clipboard.writeText(cssVars);
            toast.success('CSS Variables copied!');
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
        >
          <Copy size={14} /> Copy CSS
        </button>
      </div>

      {colorGroups.map((group) => (
        <div key={group.label} className="space-y-3">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{group.label}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.keys.map((key) => (
              <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-zinc-400 uppercase">{key}</label>
                  <button
                    onClick={() => handleCopy(key, String(tokens[key as keyof BrandTokens['color']]))}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    {copiedToken === key ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded border border-zinc-700 cursor-pointer relative overflow-hidden"
                    style={{ backgroundColor: String(tokens[key as keyof BrandTokens['color']]) }}
                  >
                    <input
                      type="color"
                      value={String(tokens[key as keyof BrandTokens['color']])}
                      onChange={(e) => onChange({ ...tokens, [key]: e.target.value })}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={String(tokens[key as keyof BrandTokens['color']])}
                    onChange={(e) => onChange({ ...tokens, [key]: e.target.value })}
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 font-mono flex-1"
                  />
                </div>
                <div className="flex gap-1 text-[10px] text-zinc-500 font-mono">
                  <span>
                    {(() => {
                      const colorValue = tokens[key as keyof BrandTokens['color']];
                      if (!colorValue || colorValue === 'undefined' || colorValue === 'null') {
                        return '-';
                      }
                      try {
                        return chroma(String(colorValue)).rgb().join(', ');
                      } catch {
                        return '-';
                      }
                    })()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// TYPOGRAPHY EDITOR
// ============================================================================

interface TypographyEditorProps {
  tokens: BrandTokens['typography'];
  onChange: (val: BrandTokens['typography']) => void;
}

function TypographyEditor({ tokens, onChange }: TypographyEditorProps) {
  const fontFamilies = [
    { name: 'Inter', value: "'Inter', -apple-system, system-ui, sans-serif" },
    { name: 'Roboto', value: "'Roboto', -apple-system, system-ui, sans-serif" },
    { name: 'Open Sans', value: "'Open Sans', -apple-system, system-ui, sans-serif" },
    { name: 'Source Sans Pro', value: "'Source Sans Pro', -apple-system, system-ui, sans-serif" },
    { name: 'Poppins', value: "'Poppins', -apple-system, system-ui, sans-serif" },
    { name: 'Space Grotesk', value: "'Space Grotesk', -apple-system, system-ui, sans-serif" },
    { name: 'IBM Plex Sans', value: "'IBM Plex Sans', -apple-system, system-ui, sans-serif" },
    { name: 'System Sans', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-medium text-white">Typography Tokens</h3>

      {/* Font Families */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Font Families</h4>

        <div className="space-y-3">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
            <label className="text-xs text-zinc-400 uppercase">Font Sans</label>
            <select
              value={tokens.fontSans}
              onChange={(e) => onChange({ ...tokens, fontSans: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300"
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
            <p className="text-sm" style={{ fontFamily: tokens.fontSans }}>
              The quick brown fox jumps over the lazy dog
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
            <label className="text-xs text-zinc-400 uppercase">Font Mono</label>
            <select
              value={tokens.fontMono}
              onChange={(e) => onChange({ ...tokens, fontMono: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300"
            >
              <option value="var(--font-geist-mono), 'SFMono-Regular', Menlo, monospace">Geist Mono</option>
              <option value="'Fira Code', 'SFMono-Regular', Menlo, monospace">Fira Code</option>
              <option value="'JetBrains Mono', 'SFMono-Regular', Menlo, monospace">JetBrains Mono</option>
              <option value="'SFMono-Regular', Menlo, monospace">SF Mono</option>
            </select>
            <p className="text-sm font-mono" style={{ fontFamily: tokens.fontMono }}>
              const greeting = "Hello World";
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
            <label className="text-xs text-zinc-400 uppercase">Font Display</label>
            <select
              value={tokens.fontDisplay}
              onChange={(e) => onChange({ ...tokens, fontDisplay: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300"
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
            <p className="text-2xl font-semibold" style={{ fontFamily: tokens.fontDisplay }}>
              Display Heading
            </p>
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Font Weights</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'weightRegular', label: 'Regular' },
            {key: 'weightMedium', label: 'Medium' },
            {key: 'weightBold', label: 'Bold' },
          ].map(({ key, label }) => (
            <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
              <label className="text-xs text-zinc-400 uppercase">{label}</label>
              <input
                type="number"
                value={tokens[key as keyof BrandTokens['typography']] as number}
                onChange={(e) => onChange({ ...tokens, [key]: parseInt(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300"
                min="100"
                max="900"
                step="100"
              />
              <p className="text-sm" style={{ fontWeight: tokens[key as keyof BrandTokens['typography']] as number }}>
                Aa {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Line Heights & Letter Spacing */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Metrics</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'lineHeightBody', label: 'Body LH', min: 1, max: 2, step: 0.05 },
            { key: 'lineHeightHeading', label: 'Heading LH', min: 1, max: 1.5, step: 0.05 },
            { key: 'letterSpacingBody', label: 'Body LS', min: -0.05, max: 0.1, step: 0.005 },
            { key: 'letterSpacingHeading', label: 'Heading LS', min: -0.05, max: 0.05, step: 0.005 },
          ].map(({ key, label, min, max, step }) => (
            <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
              <label className="text-xs text-zinc-400 uppercase">{label}</label>
              <input
                type="number"
                value={tokens[key as keyof BrandTokens['typography']] as number}
                onChange={(e) => onChange({ ...tokens, [key]: parseFloat(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300"
                min={min}
                max={max}
                step={step}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SPACING EDITOR
// ============================================================================

interface SpacingEditorProps {
  tokens: BrandTokens['spacing'];
  onChange: (val: BrandTokens['spacing']) => void;
}

function SpacingEditor({ tokens, onChange }: SpacingEditorProps) {
  const spacingKeys = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Spacing Scale</h3>
        <button
          onClick={() => {
            const scale = spacingKeys.map(key => `  --bm-space-${key}: ${tokens[key]};`).join('\n');
            navigator.clipboard.writeText(scale);
            toast.success('Spacing scale copied!');
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
        >
          <Copy size={14} /> Copy CSS
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {spacingKeys.map((key) => {
          const value = tokens[key];
          const numericValue = parseFloat(value);
          const previewSize = numericValue * 8; // Scale up for visibility

          return (
            <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400 uppercase">{key}</label>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    toast.success(`${key} copied!`);
                  }}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Copy size={12} />
                </button>
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange({ ...tokens, [key]: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 font-mono text-center"
              />
              <div className="flex justify-center">
                <div
                  className="bg-amber-500/20 border border-amber-500/50 rounded"
                  style={{ width: `${Math.max(previewSize, 8)}px`, height: `${Math.max(previewSize, 8)}px` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Spacing Preview */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Preview</h4>
        <div className="space-y-2">
          {spacingKeys.map((key) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 w-8">{key}</span>
              <div className="bg-zinc-800 rounded" style={{ width: tokens[key], height: '24px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// RADIUS EDITOR
// ============================================================================

interface RadiusEditorProps {
  tokens: BrandTokens['radius'];
  onChange: (val: BrandTokens['radius']) => void;
}

function RadiusEditor({ tokens, onChange }: RadiusEditorProps) {
  const radiusKeys = ['sm', 'md', 'lg', 'xl', 'full'] as const;

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-medium text-white">Border Radius</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {radiusKeys.map((key) => {
          const value = tokens[key];
          return (
            <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
              <label className="text-xs text-zinc-400 uppercase">{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange({ ...tokens, [key]: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 font-mono text-center"
              />
              <div className="flex justify-center">
                <div
                  className="bg-amber-500/20 border-2 border-amber-500/50"
                  style={{
                    borderRadius: key === 'full' ? '9999px' : value,
                    width: '48px',
                    height: '48px'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Radius Comparison */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Comparison</h4>
        <div className="flex gap-4 flex-wrap">
          {radiusKeys.map((key) => (
            <div key={key} className="text-center">
              <div
                className="bg-zinc-700 border-2 border-amber-500/30 mb-2"
                style={{
                  borderRadius: key === 'full' ? '9999px' : tokens[key],
                  width: '64px',
                  height: '64px'
                }}
              />
              <span className="text-xs text-zinc-400">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SHADOW EDITOR
// ============================================================================

interface ShadowEditorProps {
  tokens: BrandTokens['shadow'];
  onChange: (val: BrandTokens['shadow']) => void;
}

function ShadowEditor({ tokens, onChange }: ShadowEditorProps) {
  const shadowKeys = ['sm', 'md', 'lg', 'glow', 'inset'] as const;

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-medium text-white">Shadows</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {shadowKeys.map((key) => {
          const value = tokens[key];
          return (
            <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400 uppercase">{key}</label>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    toast.success(`${key} shadow copied!`);
                  }}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Copy size={12} />
                </button>
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange({ ...tokens, [key]: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 font-mono"
              />
              <div
                className="bg-zinc-800 rounded p-4 flex items-center justify-center"
                style={{ boxShadow: value }}
              >
                <span className="text-xs text-zinc-400">Preview</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shadow Presets */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick Presets</h4>
        <div className="flex gap-2 flex-wrap">
          {[
            { name: 'Subtle', sm: '0 1px 2px rgba(0,0,0,0.3)', md: '0 4px 8px rgba(0,0,0,0.3)', lg: '0 8px 16px rgba(0,0,0,0.3)', glow: '0 0 0 1px rgba(245,197,24,0.15)', inset: 'inset 0 1px 0 rgba(255,255,255,0.04)' },
            { name: 'Strong', sm: '0 2px 4px rgba(0,0,0,0.5)', md: '0 8px 20px rgba(0,0,0,0.5)', lg: '0 20px 40px rgba(0,0,0,0.5)', glow: '0 0 20px rgba(245,197,24,0.4)', inset: 'inset 0 2px 4px rgba(0,0,0,0.3)' },
            { name: 'Dramatic', sm: '0 4px 8px rgba(0,0,0,0.7)', md: '0 16px 32px rgba(0,0,0,0.7)', lg: '0 32px 64px rgba(0,0,0,0.7)', glow: '0 0 40px rgba(245,197,24,0.6)', inset: 'inset 0 4px 8px rgba(0,0,0,0.5)' },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => onChange(preset)}
              className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MOTION EDITOR
// ============================================================================

interface MotionEditorProps {
  tokens: BrandTokens['motion'];
  onChange: (val: BrandTokens['motion']) => void;
}

function MotionEditor({ tokens, onChange }: MotionEditorProps) {
  const motionKeys = ['fast', 'normal', 'slow'] as const;
  const easings = [
    { name: 'Standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    { name: 'Emphasis', value: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
    { name: 'Decelerate', value: 'cubic-bezier(0, 0, 0.2, 1)' },
    { name: 'Accelerate', value: 'cubic-bezier(0.4, 0, 1, 1)' },
    { name: 'Linear', value: 'linear' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-medium text-white">Motion & Animation</h3>

      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Durations</h4>
        <div className="grid grid-cols-3 gap-3">
          {motionKeys.map((key) => (
            <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
              <label className="text-xs text-zinc-400 uppercase">{key}</label>
              <input
                type="text"
                value={tokens[key]}
                onChange={(e) => onChange({ ...tokens, [key]: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 font-mono text-center"
              />
              <div
                className="h-2 bg-amber-500 rounded-full mx-auto"
                style={{
                  animation: `pulse ${tokens[key]} ease-in-out`,
                  animationIterationCount: 'infinite'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Easing Functions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'easingStandard', label: 'Standard' },
            { key: 'easingEmphasis', label: 'Emphasis' },
          ].map(({ key, label }) => (
            <div key={key} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-2">
              <label className="text-xs text-zinc-400 uppercase">{label}</label>
              <select
                value={tokens[key as keyof BrandTokens['motion']]}
                onChange={(e) => onChange({ ...tokens, [key]: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300 font-mono"
              >
                {easings.map(easing => (
                  <option key={easing.value} value={easing.value}>{easing.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Easing Preview */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Easing Preview</h4>
        <div className="space-y-3">
          {easings.map((easing) => (
            <div key={easing.value} className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 w-20">{easing.name}</span>
              <div className="flex-1 h-8 bg-zinc-800 rounded overflow-hidden relative">
                <div
                  className="absolute h-full bg-amber-500"
                  style={{
                    animation: `slide 1.5s ${easing.value} infinite`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { left: 0%; }
          50% { left: calc(100% - 40px); }
          100% { left: 0%; }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// TOKEN PREVIEW PANEL
// ============================================================================

interface TokenPreviewProps {
  tokens: BrandTokens;
}

function TokenPreview({ tokens }: TokenPreviewProps) {
  const [previewTab, setPreviewTab] = useState<'button' | 'card' | 'input' | 'text'>('button');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-zinc-800 bg-[#050505]">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
          <Eye size={12} /> Live Preview
        </h3>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-auto">
        {/* Button Preview */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h4 className="text-xs text-zinc-500 uppercase mb-3">Buttons</h4>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-4 py-2 rounded text-sm font-medium transition-all"
              style={{
                backgroundColor: tokens.color.accent,
                color: tokens.color.accentContrast,
                borderRadius: tokens.radius.sm,
                boxShadow: tokens.shadow.sm,
                transitionDuration: tokens.motion.fast,
                transitionTimingFunction: tokens.motion.easingStandard,
              }}
            >
              Primary
            </button>
            <button
              className="px-4 py-2 rounded text-sm font-medium transition-all"
              style={{
                backgroundColor: tokens.color.surfaceMuted,
                color: tokens.color.textPrimary,
                borderRadius: tokens.radius.sm,
                border: `1px solid ${tokens.color.borderStrong}`,
                boxShadow: tokens.shadow.sm,
                transitionDuration: tokens.motion.fast,
                transitionTimingFunction: tokens.motion.easingStandard,
              }}
            >
              Secondary
            </button>
          </div>
        </div>

        {/* Card Preview */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h4 className="text-xs text-zinc-500 uppercase mb-3">Card</h4>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: tokens.color.surface,
              borderRadius: tokens.radius.lg,
              border: `1px solid ${tokens.color.border}`,
              boxShadow: tokens.shadow.md,
            }}
          >
            <p
              className="text-sm mb-2"
              style={{
                color: tokens.color.textPrimary,
                fontFamily: tokens.typography.fontSans,
                fontWeight: tokens.typography.weightMedium,
                lineHeight: tokens.typography.lineHeightBody,
              }}
            >
              Card Title
            </p>
            <p
              className="text-xs"
              style={{
                color: tokens.color.textSecondary,
                fontFamily: tokens.typography.fontSans,
                lineHeight: tokens.typography.lineHeightBody,
              }}
            >
              Card description with brand tokens applied. This is how your content will look.
            </p>
          </div>
        </div>

        {/* Input Preview */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h4 className="text-xs text-zinc-500 uppercase mb-3">Input</h4>
          <input
            type="text"
            placeholder="Enter text..."
            className="w-full px-3 py-2 text-sm rounded"
            style={{
              backgroundColor: `color-mix(in srgb, ${tokens.color.background} 80%, #000 20%)`,
              color: tokens.color.textPrimary,
              border: `1px solid ${tokens.color.borderStrong}`,
              borderRadius: tokens.radius.md,
              fontFamily: tokens.typography.fontSans,
              outline: 'none',
            }}
          />
        </div>

        {/* Typography Scale Preview */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h4 className="text-xs text-zinc-500 uppercase mb-3">Typography Scale</h4>
          <div className="space-y-2">
            {[
              { name: 'Heading 1', size: '24px', weight: tokens.typography.weightBold },
              { name: 'Heading 2', size: '20px', weight: tokens.typography.weightBold },
              { name: 'Heading 3', size: '16px', weight: tokens.typography.weightMedium },
              { name: 'Body', size: '14px', weight: tokens.typography.weightRegular },
            ].map(({ name, size, weight }) => (
              <p
                key={name}
                style={{
                  fontSize: size,
                  fontWeight: weight,
                  color: tokens.color.textPrimary,
                  fontFamily: tokens.typography.fontSans,
                  lineHeight: tokens.typography.lineHeightHeading,
                  letterSpacing: tokens.typography.letterSpacingHeading,
                }}
              >
                {name}
              </p>
            ))}
          </div>
        </div>

        {/* Spacing Preview */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h4 className="text-xs text-zinc-500 uppercase mb-3">Spacing Scale</h4>
          <div className="flex items-end gap-1">
            {['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((key) => (
              <div
                key={key}
                className="bg-amber-500/20 border border-amber-500/30 rounded-t"
                style={{
                  width: tokens.spacing[key as keyof BrandTokens['spacing']],
                  height: tokens.spacing[key as keyof BrandTokens['spacing']],
                  minHeight: '8px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DesignTokensWorkspace({ brandId }: { brandId: string }) {
  const { brandTokens, saveTokens, isLoading } = useBrandTokens(brandId);
  const [localTokens, setLocalTokens] = useState<BrandTokens | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (brandTokens && !localTokens) {
      setLocalTokens(brandTokens);
    }
  }, [brandTokens, localTokens]);

  const handleSave = useCallback(async () => {
    if (!localTokens) return false;

    try {
      await saveTokens(localTokens);
      setHasChanges(false);
      return true;
    } catch (error) {
      console.error('Error saving tokens:', error);
      return false;
    }
  }, [localTokens, saveTokens]);

  if (isLoading || !localTokens) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">Cargando Design Tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <BaseWorkspace
      brandId={brandId}
      moduleKey="designTokens"
      moduleName="Design Tokens"
      moduleSubtitle="Define los átomos visuales de tu marca"
      backLink={`/dashboard/brands/${brandId}`}
      customSave={handleSave}
    >
      {({ data, status, updateStatus }) => (
        <div className="h-full flex flex-col">
          <Tabs defaultValue="color" className="h-full flex flex-col">
            <div className="border-b border-zinc-800 px-6 bg-[#050505]">
              <TabsList className="bg-transparent h-12 p-0 gap-6">
                <TabsTrigger value="color" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                  <Palette size={14} className="mr-2" /> Color
                </TabsTrigger>
                <TabsTrigger value="typography" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                  <Type size={14} className="mr-2" /> Typography
                </TabsTrigger>
                <TabsTrigger value="spacing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                  <Move size={14} className="mr-2" /> Spacing
                </TabsTrigger>
                <TabsTrigger value="radius" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                  <Box size={14} className="mr-2" /> Radius
                </TabsTrigger>
                <TabsTrigger value="shadow" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                  <Layers size={14} className="mr-2" /> Shadow
                </TabsTrigger>
                <TabsTrigger value="motion" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none h-full px-0 text-zinc-400 data-[state=active]:text-white">
                  <Sliders size={14} className="mr-2" /> Motion
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 bg-[#0A0A0A]">
                <ScrollArea className="h-full">
                  <TabsContent value="color" className="m-0 min-h-full">
                    <ColorEditor
                      tokens={localTokens.color}
                      onChange={(c) => {
                        setLocalTokens({ ...localTokens, color: c });
                        setHasChanges(true);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="typography" className="m-0">
                    <TypographyEditor
                      tokens={localTokens.typography}
                      onChange={(t) => {
                        setLocalTokens({ ...localTokens, typography: t });
                        setHasChanges(true);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="spacing" className="m-0">
                    <SpacingEditor
                      tokens={localTokens.spacing}
                      onChange={(s) => {
                        setLocalTokens({ ...localTokens, spacing: s });
                        setHasChanges(true);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="radius" className="m-0">
                    <RadiusEditor
                      tokens={localTokens.radius}
                      onChange={(r) => {
                        setLocalTokens({ ...localTokens, radius: r });
                        setHasChanges(true);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="shadow" className="m-0">
                    <ShadowEditor
                      tokens={localTokens.shadow}
                      onChange={(s) => {
                        setLocalTokens({ ...localTokens, shadow: s });
                        setHasChanges(true);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="motion" className="m-0">
                    <MotionEditor
                      tokens={localTokens.motion}
                      onChange={(m) => {
                        setLocalTokens({ ...localTokens, motion: m });
                        setHasChanges(true);
                      }}
                    />
                  </TabsContent>
                </ScrollArea>
              </div>

              {/* Preview Panel */}
              <div className="w-[400px] border-l border-zinc-800 bg-[#050505] hidden lg:block">
                <TokenPreview tokens={localTokens} />
              </div>
            </div>

            {/* Changes indicator */}
            {hasChanges && (
              <div className="border-t border-zinc-800 bg-[#050505] px-6 py-3 flex items-center justify-between">
                <span className="text-sm text-amber-500">Tienes cambios sin guardar</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLocalTokens(brandTokens);
                      setHasChanges(false);
                    }}
                    className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
                  >
                    Descartar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 rounded text-black font-medium transition-colors"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            )}
          </Tabs>
        </div>
      )}
    </BaseWorkspace>
  );
}
