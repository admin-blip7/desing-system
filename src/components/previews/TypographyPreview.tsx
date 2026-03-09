"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypographyScale {
    name: string;
    size: string;
    weight: string;
    lineHeight: string;
    sample: string;
}

interface FontFamily {
    name: string;
    provider: "google" | "local" | "system";
    url?: string;
    weights: string[];
}

interface TypographySystem {
    headings: FontFamily;
    body: FontFamily;
    scale: TypographyScale[];
}

interface TypographyPreviewProps {
    content: string; // JSON string
}

export default function TypographyPreview({ content }: TypographyPreviewProps) {
    const [system, setSystem] = useState<TypographySystem | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const parsed = JSON.parse(content);
            setSystem(parsed);
            setError(null);

            // Load Google Fonts if needed
            if (parsed.headings?.provider === 'google' && parsed.headings.name) {
                loadGoogleFont(parsed.headings.name);
            }
            if (parsed.body?.provider === 'google' && parsed.body.name) {
                loadGoogleFont(parsed.body.name);
            }

        } catch (e) {
            setError("Invalid JSON format for typography system");
        }
    }, [content]);

    const loadGoogleFont = (fontName: string) => {
        const linkId = `font-${fontName.replace(/\s+/g, '-')}`;
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    };

    if (error) return <div className="text-red-500">{error}</div>;
    if (!system) return <div className="text-zinc-500">Loading typography system...</div>;

    return (
        <div className="space-y-12 p-4">
            {/* Font Families Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">Headings Font</span>
                    <h2 className="text-4xl text-white mb-2" style={{ fontFamily: system.headings?.name }}>
                        {system.headings?.name || 'System Sans'}
                    </h2>
                    <p className="text-zinc-400 text-sm">
                        {system.headings?.provider === 'google' ? 'Google Fonts' : 'System/Local'}
                    </p>
                    <div className="mt-4 text-6xl text-white opacity-20" style={{ fontFamily: system.headings?.name }}>
                        Aa Bb Cc
                    </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">Body Font</span>
                    <h2 className="text-4xl text-white mb-2" style={{ fontFamily: system.body?.name }}>
                        {system.body?.name || 'System Sans'}
                    </h2>
                    <p className="text-zinc-400 text-sm">
                        {system.body?.provider === 'google' ? 'Google Fonts' : 'System/Local'}
                    </p>
                    <div className="mt-4 text-6xl text-white opacity-20" style={{ fontFamily: system.body?.name }}>
                        Aa Bb Cc
                    </div>
                </div>
            </div>

            {/* Scale Preview */}
            <div className="space-y-8">
                <h3 className="text-lg font-medium text-white border-b border-zinc-800 pb-2">Type Scale</h3>
                {system.scale?.map((step, i) => (
                    <div key={i} className="group">
                        <div className="flex items-baseline justify-between mb-1 text-xs text-zinc-500 font-mono">
                            <span>{step.name}</span>
                            <span>{step.size} / {step.weight} / {step.lineHeight}</span>
                        </div>
                        <p
                            className="text-zinc-200 transition-colors group-hover:text-yellow-500"
                            style={{
                                fontFamily: system.headings?.name, // Assuming headings font for display, ideally configurable
                                fontSize: step.size,
                                fontWeight: step.weight,
                                lineHeight: step.lineHeight
                            }}
                        >
                            {step.sample || "The quick brown fox jumps over the lazy dog"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Contextual Preview */}
            <div className="bg-white rounded-xl p-8 mt-12">
                <h3 className="text-black font-bold text-2xl mb-6 font-mono text-xs uppercase tracking-widest opacity-50">Context Preview</h3>

                <article className="max-w-2xl mx-auto space-y-6">
                    <h1 style={{ fontFamily: system.headings?.name }} className="text-4xl font-bold text-black">
                        Designing for the Future of Brands
                    </h1>
                    <p style={{ fontFamily: system.body?.name }} className="text-lg text-gray-700 leading-relaxed">
                        A strong brand identity is more than just a logo. It is a comprehensive system that governs how a company presents itself to the world. Typography plays a crucial role in this system, communicating hierarchy, tone, and character.
                    </p>
                    <div className="pl-6 border-l-4 border-black">
                        <p style={{ fontFamily: system.headings?.name }} className="text-xl italic text-gray-900">
                            "Typography is the voice of your written words."
                        </p>
                    </div>
                    <p style={{ fontFamily: system.body?.name }} className="text-base text-gray-600 leading-relaxed">
                        When selecting typefaces, we consider legibility, versatility, and personality. The combination of
                        <span className="font-bold"> {system.headings?.name}</span> for headlines and
                        <span className="font-bold"> {system.body?.name}</span> for body text creates a harmony that serves the brand's message effectively across all touchpoints.
                    </p>
                    <button
                        className="px-6 py-3 bg-black text-white rounded-lg mt-4 font-medium"
                        style={{ fontFamily: system.body?.name }}
                    >
                        Call to Action
                    </button>
                </article>
            </div>
        </div>
    );
}
