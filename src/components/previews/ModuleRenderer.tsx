import MarkdownPreview from "@/components/previews/MarkdownPreview";
import ColorPaletteEditor from "@/components/previews/ColorPaletteEditor";
import TypographyPreview from "@/components/previews/TypographyPreview";
import ImagePreview from "@/components/previews/ImagePreview";
import Phase2SystemPreview from "@/components/previews/Phase2SystemPreview";

interface ModuleRendererProps {
    moduleName: string;
    content: string | any;
}

export default function ModuleRenderer({ moduleName, content }: ModuleRendererProps) {
    if (!content) return null;
    const effectiveContent =
        content && typeof content === "object" && "__payload" in (content as Record<string, unknown>)
            ? (content as any).__payload
            : content;

    const key = moduleName.toLowerCase();
    const isColorModule = key.includes("color") || key.includes("palette") || key.includes("chromatic") || key.includes("paleta de color");
    const isTypographyModule = key.includes("typography") || key.includes("font") || key.includes("tipografía");
    // Check if content is JSON string/object
    const contentString = typeof effectiveContent === 'string' ? effectiveContent : JSON.stringify(effectiveContent);
    // Parse content to check for image data
    let parsedContent: any = null;
    try {
        parsedContent = typeof effectiveContent === 'string' ? JSON.parse(effectiveContent) : effectiveContent;
    } catch (e) {
        // Not JSON
    }

    const isImageModule = parsedContent && (parsedContent.imageUrl || parsedContent.type === 'visual');
    const trimmed = contentString.trim();
    const isJson = trimmed.startsWith("{") || trimmed.startsWith("[");

    if (isImageModule) {
        return (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Visual Asset</h3>
                </div>
                <div className="p-4">
                    <ImagePreview content={parsedContent} />
                </div>
            </div>
        )
    }

    if (isColorModule && isJson) {
        return (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Color Palette</h3>
                </div>
                <div className="p-4 pointer-events-none">
                    <ColorPaletteEditor content={contentString} />
                </div>
            </div>
        );
    }

    if (isTypographyModule && isJson) {
        return (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Typography System</h3>
                </div>
                <div className="p-4">
                    <TypographyPreview content={contentString} />
                </div>
            </div>
        );
    }

    if (isJson) {
        return (
            <Phase2SystemPreview
                moduleName={moduleName}
                content={contentString}
            />
        );
    }

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
                <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Narrative</h3>
            </div>
            <div className="p-8">
                <MarkdownPreview content={contentString} />
            </div>
        </div>
    );
}
