import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Edit3, Check, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MarkdownPreview from "@/components/previews/MarkdownPreview";
import ColorPaletteEditor from "@/components/previews/ColorPaletteEditor";
import TypographyPreview from "@/components/previews/TypographyPreview";
import ImagePreview from "@/components/previews/ImagePreview";
import { regenerateModuleAction } from "@/actions/regenerate-module";
import { useParams } from "next/navigation";

interface ModuleEditorProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    initialContent: string | any;
    moduleKey: string;
    onSave: (content: string | any) => Promise<void>;
}

export default function ModuleEditor({ isOpen, onClose, title, initialContent, moduleKey, onSave }: ModuleEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // We need brandId for regeneration. 
    // Ideally it should be passed as prop, but we can grab it from params or use a prop in future.
    // Let's assume params has it since this is usually mounted under dashboard/brands/[id]
    const params = useParams();
    const brandId = params.id as string;

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const key = moduleKey.toLowerCase();
    const isColorModule = key.includes("color") || key.includes("palette") || key.includes("chromatic");
    const isTypographyModule = key.includes("typography") || key.includes("font") || key.includes("tipografía");

    // Determine if content is complex object (visual module)
    const isVisualObject = typeof content === 'object' && content !== null && (content.imageUrl || content.type === 'visual');
    const contentString = typeof content === 'string' ? content : JSON.stringify(content);
    const isJson = contentString.trim().startsWith("{");


    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(content);
            setIsEditing(false);
            toast.success("Cambios guardados");
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRegenerate = async () => {
        if (!confirm("Esto reemplazará el contenido actual con uno nuevo generado por IA. ¿Continuar?")) return;

        setIsRegenerating(true);
        try {
            const result = await regenerateModuleAction(brandId, moduleKey);
            if (result.success && result.data) {
                setContent(result.data.content);
                // Also update the parent view effectively? 
                // Since `regenerateModuleAction` revalidates path, the parent grid might update, 
                // but this local modal state needs the new content.
                toast.success("Módulo regenerado correctamente");
                // Note: The onSave callback in parent usually refreshes state.
                // We might want to auto-save or just notify parent?
                // For now, let's just update local content. The user can then click 'Save' if they want to keep it?
                // Wait, regenerateAction writes to DB. So we should treat it as saved.
                // We might need a onRefresh prop or verify if initialContent updates from parent revalidation?
                // Next.js server actions revalidatePath refreshes server components. Client components might need manual refresh or router.refresh()
                // But since we are in a client component, `content` state holds truth.
            } else {
                toast.error("Error al regenerar: " + (result.error || "Error desconocido"));
            }
        } catch (error) {
            toast.error("Error al regenerar");
        } finally {
            setIsRegenerating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-20 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950/50">
                            <div>
                                <h2 className="text-xl font-medium text-white">{title}</h2>
                                <p className="text-sm text-zinc-500">Editor de contenido generado por IA</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRegenerate}
                                    disabled={isRegenerating || isSaving}
                                    className="mr-2 text-zinc-400 hover:text-white border-zinc-700"
                                >
                                    <RefreshCw size={16} className={`mr-2 ${isRegenerating ? "animate-spin" : ""}`} />
                                    {isRegenerating ? "Regenerando..." : "Regenerar"}
                                </Button>

                                {!isEditing ? (
                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit3 size={16} className="mr-2" />
                                        Editar
                                    </Button>
                                ) : (
                                    <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        {isSaving ? "Guardando..." : (
                                            <>
                                                <Check size={16} className="mr-2" />
                                                Guardar
                                            </>
                                        )}
                                    </Button>
                                )}

                                <Button size="sm" variant="ghost" onClick={onClose} className="ml-2">
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden relative">
                            {isEditing ? (
                                isColorModule && isJson ? (
                                    <div className="h-full overflow-auto bg-zinc-950 rounded-lg border border-zinc-800/50">
                                        <ColorPaletteEditor
                                            content={contentString}
                                            onChange={(newContent) => setContent(newContent)}
                                        />
                                    </div>
                                ) : isVisualObject ? (
                                    <div className="flex gap-6 h-full">
                                        {/* For visual objects, we only edit the text part for now */}
                                        <div className="w-1/2 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                                            <label className="text-xs font-mono text-zinc-500 mb-2 block">Rational / Description</label>
                                            <textarea
                                                value={content.text || ""}
                                                onChange={(e) => setContent({ ...content, text: e.target.value })}
                                                className="w-full h-[90%] bg-zinc-900/50 p-4 rounded text-zinc-300 font-mono text-sm border-none focus:ring-1 focus:ring-yellow-500 resize-none"
                                            />
                                        </div>
                                        <div className="w-1/2 overflow-auto">
                                            <ImagePreview content={content} />
                                        </div>
                                    </div>
                                ) : (
                                    <textarea
                                        value={typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full h-full min-h-[500px] bg-zinc-950 p-6 rounded-lg text-zinc-200 font-mono text-sm leading-relaxed border border-zinc-800 focus:ring-1 focus:ring-yellow-500 outline-none resize-none"
                                    />
                                )
                            ) : (
                                isVisualObject ? (
                                    <div className="h-full overflow-auto bg-zinc-950 rounded-lg border border-zinc-800/50 p-6">
                                        <ImagePreview content={content} />
                                    </div>
                                ) : isColorModule && isJson ? (
                                    <div className="h-full overflow-auto bg-zinc-950 rounded-lg border border-zinc-800/50 pointer-events-none opacity-90">
                                        <ColorPaletteEditor
                                            content={contentString}
                                            onChange={() => { }}
                                        />
                                    </div>
                                ) : isTypographyModule && isJson ? (
                                    <div className="h-full overflow-auto bg-zinc-950 rounded-lg border border-zinc-800/50">
                                        <TypographyPreview content={contentString} />
                                    </div>
                                ) : (
                                    <div className="h-full overflow-auto bg-zinc-950 p-8 rounded-lg border border-zinc-800/50">
                                        <MarkdownPreview content={contentString} />
                                    </div>
                                )
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
