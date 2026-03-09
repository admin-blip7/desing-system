"use client";

import { useState } from "react";
import { personalities, dnaCategories, BrandPersonality } from "@/lib/data/personalities";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useBrandTheme } from "@/components/theme/BrandThemeProvider";

interface CSSPreviewProps {
    css: BrandPersonality["cssPreview"];
    name: string;
}

function CSSPreview({ css, name }: CSSPreviewProps) {
    if (!css) return null;
    return (
        <div
            style={{
                background: css.background,
                fontFamily: css.fontFamily,
            }}
            className="rounded-lg p-5 overflow-hidden border transition-all duration-300"
        >
            <div
                style={{ color: css.accent }}
                className="text-[9px] tracking-[0.2em] uppercase mb-2 opacity-70 font-semibold"
            >
                PREVIEW — {name}
            </div>
            <div
                style={{ color: css.foreground }}
                className="text-2xl font-light mb-1 tracking-tight"
            >
                Tu Marca Aquí
            </div>
            <div
                style={{ color: css.foreground }}
                className="text-xs opacity-50 mb-4"
            >
                Así se vería tu manual de marca con esta personalidad
            </div>
            <div className="flex gap-2">
                <div
                    style={{
                        borderRadius: css.radius,
                        background: css.accent,
                        color: css.background,
                        fontFamily: css.fontFamily
                    }}
                    className="px-4 py-2 text-[11px] font-semibold"
                >
                    Botón primario
                </div>
                <div
                    style={{
                        borderRadius: css.radius,
                        borderColor: `${css.accent}80`,
                        color: css.accent,
                        fontFamily: css.fontFamily
                    }}
                    className="px-4 py-2 text-[11px] font-medium border"
                >
                    Secundario
                </div>
            </div>
            <div className="flex gap-1.5 mt-3">
                {[css.background, css.foreground, css.accent, `${css.accent}80`, `${css.foreground}40`].map((c, i) => (
                    <div
                        key={i}
                        style={{ background: c }}
                        className={`w-6 h-6 border border-white/10 ${css.radius === "0px" ? "rounded-none" : "rounded"}`}
                    />
                ))}
            </div>
        </div>
    );
}

interface PersonalitySelectorProps {
    onSelect: (id: string) => void;
}

export default function PersonalitySelector({ onSelect }: PersonalitySelectorProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [view, setView] = useState<"grid" | "compare" | "flow">("grid");
    const [activeDna, setActiveDna] = useState<keyof NonNullable<BrandPersonality["dna"]>>("typography");
    const { applyBrandTheme } = useBrandTheme();

    const active = personalities.find(p => p.id === selected);
    const handleSelectPreview = (id: string) => {
        setSelected(id);
        applyBrandTheme(id);
    };

    return (
        <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)] font-sans selection:bg-[var(--bm-color-accent-muted)]">
            {/* Header */}
            <div className="px-8 py-6 border-b sticky top-0 backdrop-blur-md z-50 border-[var(--bm-color-border)] bg-[color-mix(in_srgb,var(--bm-color-bg)_85%,transparent)]">
                <div className="flex justify-between items-start max-w-7xl mx-auto">
                    <div>
                        <div className="text-[9px] tracking-[0.3em] uppercase font-medium text-[var(--bm-color-text-secondary)]">Brand Manual Generator</div>
                        <h1 className="text-3xl font-extralight mt-1 tracking-tight text-[var(--bm-color-text-primary)]">
                            ¿Qué personalidad define tu marca?
                        </h1>
                        <p className="text-sm mt-2 max-w-2xl leading-relaxed text-[var(--bm-color-text-secondary)]">
                            Cada personalidad es un sistema de diseño completo pre-analizado. Selecciona una como base y personalízala, o elige <span className="text-[var(--bm-color-accent)]">Modo Manual</span> para construir desde cero.
                        </p>
                    </div>
                    <div className="flex gap-1 rounded-lg p-1 bg-[var(--bm-color-surface-muted)]">
                        {[
                            { k: "grid", l: "Seleccionar" },
                            { k: "compare", l: "Comparar" },
                            { k: "flow", l: "Flujo" }
                        ].map(v => (
                            <button
                                key={v.k}
                                onClick={() => setView(v.k as any)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-[10px] font-medium transition-all",
                                    view === v.k
                                        ? "bg-[var(--bm-card-bg)] text-[var(--bm-color-accent)] shadow-sm"
                                        : "text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
                                )}
                            >
                                {v.l}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* GRID VIEW — Selection */}
                {view === "grid" && !selected && (
                    <div className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {personalities.map(p => (
                                <motion.button
                                    key={p.id}
                                    onClick={() => handleSelectPreview(p.id)}
                                    whileHover={{ y: -4 }}
                                    className="rounded-xl p-6 text-left transition-all relative overflow-hidden group"
                                    style={{
                                        background: p.cardBg,
                                        border: `1px solid ${p.color}20`
                                    }}
                                >
                                    {p.id === "manual" && (
                                        <div
                                            className="absolute top-0 left-0 right-0 h-0.5"
                                            style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }}
                                        />
                                    )}
                                    <div
                                        className="text-[9px] tracking-[0.2em] font-bold uppercase mb-4"
                                        style={{ color: p.color }}
                                    >
                                        {p.id === "manual" ? "★ AVANZADO" : p.archetype}
                                    </div>
                                    <div className="text-xl font-light text-[var(--bm-color-text-primary)] mb-2">{p.name}</div>
                                    <div className="text-xs leading-relaxed mb-4 min-h-[48px] line-clamp-3 text-[var(--bm-color-text-secondary)]">
                                        {p.tagline}
                                    </div>
                                    {p.ideal.length > 0 && p.id !== "manual" && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {p.ideal.slice(0, 3).map((t, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[8px] px-1.5 py-0.5 rounded-sm"
                                                    style={{
                                                        background: `${p.color}15`,
                                                        color: `${p.color}90`
                                                    }}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {p.id === "manual" && (
                                        <div className="text-[10px] text-[var(--bm-color-accent)]/80 mt-2">
                                            + Sube tus assets existentes
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* DETAIL VIEW — Selected personality */}
                {view === "grid" && selected && active && (
                    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
                        {/* Sidebar — Switch personalities */}
                        <div className="w-full lg:w-64 border-r py-6 lg:block hidden border-[var(--bm-color-border)]">
                            {personalities.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        handleSelectPreview(p.id);
                                        setActiveDna("typography");
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 w-full px-6 py-3 text-left transition-colors border-l-2",
                                        selected === p.id
                                            ? "bg-[var(--bm-color-surface-muted)]/50"
                                            : "border-transparent hover:bg-[var(--bm-color-surface-muted)]/30"
                                    )}
                                    style={{ borderColor: selected === p.id ? p.color : "transparent" }}
                                >
                                    <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: p.color, opacity: selected === p.id ? 1 : 0.3 }}
                                    />
                                    <span className={cn(
                                        "text-xs",
                                        selected === p.id ? "text-[var(--bm-color-text-primary)] font-medium" : "text-[var(--bm-color-text-secondary)]"
                                    )}>
                                        {p.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Detail Content */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                                <div>
                                    <div
                                        className="text-[10px] tracking-[0.2em] font-bold uppercase mb-2"
                                        style={{ color: active.color }}
                                    >
                                        {active.archetype}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-thin text-[var(--bm-color-text-primary)] mb-3 tracking-tight">{active.name}</h2>
                                    <p className="text-sm max-w-xl leading-relaxed text-[var(--bm-color-text-secondary)]">{active.philosophy}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!selected) return;
                                        applyBrandTheme(selected);
                                        onSelect(selected);
                                    }}
                                    className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-lg shadow-black/50"
                                    style={{
                                        background: active.color,
                                        color: ["apple", "nothing", "polestar"].includes(active.id) ? "#000" : "#fff" // Adjust contrast based on color
                                    }}
                                >
                                    Usar esta personalidad →
                                </button>
                            </div>

                            {active.dna ? (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {/* Left — DNA Details */}
                                    <div className="space-y-6">
                                        {/* DNA Tabs */}
                                        <div className="flex gap-1 p-1 rounded-lg overflow-x-auto bg-[var(--bm-color-surface-muted)]/50">
                                            {dnaCategories.map(c => (
                                                <button
                                                    key={c.key}
                                                    onClick={() => setActiveDna(c.key as any)}
                                                    className={cn(
                                                        "flex-1 px-3 py-2 rounded-md text-[10px] font-medium transition-all flex items-center justify-center gap-2 min-w-[80px]",
                                                        activeDna === c.key ? "bg-[var(--bm-card-bg)] shadow-sm" : "hover:text-[var(--bm-color-text-primary)]"
                                                    )}
                                                    style={{ color: activeDna === c.key ? active.color : "var(--bm-color-text-secondary)" }}
                                                >
                                                    <span>{c.icon}</span>
                                                    {c.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* DNA Content */}
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeDna}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="rounded-xl p-6 border bg-[var(--bm-color-surface-muted)]/30 border-[var(--bm-color-border)]/60"
                                            >
                                                {active.dna && active.dna[activeDna] && Object.entries(active.dna[activeDna]!).map(([k, v], i) => (
                                                    <div key={k} className={cn("mb-5 last:mb-0")}>
                                                        <div
                                                            className="text-[9px] tracking-[0.2em] uppercase font-bold mb-2 opacity-80"
                                                            style={{ color: active.color }}
                                                        >
                                                            {k}
                                                        </div>
                                                        <div className="text-sm leading-relaxed font-light text-[var(--bm-color-text-primary)]/90">
                                                            {v}
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Key Principles */}
                                        <div className="pt-4">
                                            <div className="text-[9px] tracking-[0.2em] font-bold uppercase mb-4 text-[var(--bm-color-text-secondary)]">Principios Clave</div>
                                            <div className="space-y-3">
                                                {active.keyPrinciples.map((p, i) => (
                                                    <div key={i} className="flex gap-3 items-start">
                                                        <span style={{ color: active.color }} className="text-xs mt-1">→</span>
                                                        <span className="text-sm leading-relaxed text-[var(--bm-color-text-secondary)]">{p}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right — Preview + Industries */}
                                    <div className="space-y-6">
                                        <CSSPreview css={active.cssPreview} name={active.name} />

                                        <div className="rounded-xl p-6 border bg-[var(--bm-color-surface-muted)]/30 border-[var(--bm-color-border)]/60">
                                            <div className="text-[9px] tracking-[0.2em] text-emerald-500 font-bold uppercase mb-4">Ideal para</div>
                                            <div className="flex flex-wrap gap-2">
                                                {active.ideal.map((t, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[10px] px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            {active.notIdeal.length > 0 && (
                                                <>
                                                    <div className="text-[9px] tracking-[0.2em] text-rose-500 font-bold uppercase mt-6 mb-4">Menos recomendado</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {active.notIdeal.map((t, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-[10px] px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-500/70 border border-rose-500/10"
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="rounded-xl p-6 border border-[var(--bm-color-border)] bg-[var(--bm-color-bg)]">
                                            <div className="text-[9px] tracking-[0.2em] text-indigo-400 font-bold uppercase mb-3">Qué hace el sistema</div>
                                            <div className="text-xs leading-7 text-[var(--bm-color-text-secondary)]">
                                                Al elegir <strong className="text-[var(--bm-color-text-primary)]">{active.name}</strong>, el motor de generación inyecta este DNA en cada módulo. Tu paleta de colores nace de su filosofía cromática, tu tipografía sigue su escala, tu voz adopta su tono, y tus layouts respetan su densidad. Todo personalizable después.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Manual Mode */
                                <div className="rounded-xl p-8 border bg-[var(--bm-color-surface-muted)]/30 border-[var(--bm-color-accent)]/30">
                                    <div className="text-lg text-[var(--bm-color-accent)] font-medium mb-4">Modo Manual — Construye tu propia personalidad</div>
                                    <div className="text-sm leading-7 mb-8 max-w-2xl text-[var(--bm-color-text-secondary)]">
                                        El onboarding completo te guía paso a paso. Puedes subir assets existentes (logos, fotos, documentos de marca) y la IA los analiza para sugerirte una dirección. También puedes mezclar elementos de múltiples personalidades.
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                        {[
                                            { icon: "📤", title: "Sube tu logo", desc: "La IA analiza colores, formas y estilo" },
                                            { icon: "📸", title: "Sube fotos de tu marca", desc: "Extrae paleta, mood y dirección visual" },
                                            { icon: "📄", title: "Sube documentos", desc: "Manual existente, PDFs, presentaciones" },
                                            { icon: "🌐", title: "Comparte tu web", desc: "Analiza tu presencia digital actual" },
                                            { icon: "📱", title: "Comparte tu Instagram", desc: "Analiza tu grid, colores y estilo" },
                                            { icon: "🎨", title: "Mezcla personalidades", desc: "Ej: 'Tipografía de Polestar + Colores de TE'" },
                                        ].map((item, i) => (
                                            <div key={i} className="rounded-lg p-5 border transition-colors bg-[var(--bm-card-bg)] border-[var(--bm-color-border)] hover:border-[var(--bm-color-border-strong)]">
                                                <div className="text-2xl mb-3">{item.icon}</div>
                                                <div className="text-xs text-[var(--bm-color-text-primary)] font-medium mb-1">{item.title}</div>
                                                <div className="text-[10px] text-[var(--bm-color-text-secondary)]">{item.desc}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        {active.keyPrinciples.map((p, i) => (
                                            <div key={i} className="flex gap-3 items-center">
                                                <span className="text-[var(--bm-color-accent)] text-xs">→</span>
                                                <span className="text-xs text-[var(--bm-color-text-secondary)]">{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* COMPARE VIEW */}
                {view === "compare" && (
                    <div className="p-8 overflow-x-auto">
                        {/* Implementation of Compare Table similar to detail view but as a table */}
                        <div className="text-[var(--bm-color-text-secondary)] text-sm text-center py-20">Comparativa detallada próximamente</div>
                    </div>
                )}

                {/* FLOW VIEW */}
                {view === "flow" && (
                    <div className="p-8 max-w-4xl mx-auto">
                        {/* Flow Implementation */}
                        <div className="text-[var(--bm-color-text-secondary)] text-sm text-center py-20">Vista del flujo próximamente</div>
                    </div>
                )}
            </div>
        </div>
    );
}
