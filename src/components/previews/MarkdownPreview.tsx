import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
    content: string;
    className?: string;
}

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
    return (
        <article className={cn(
            "prose prose-invert prose-zinc max-w-none",
            "prose-headings:font-light prose-headings:text-white",
            "prose-h1:text-3xl prose-h1:mb-6",
            "prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-2",
            "prose-p:text-zinc-300 prose-p:leading-relaxed",
            "prose-strong:text-yellow-500 prose-strong:font-medium",
            "prose-ul:text-zinc-300 prose-li:marker:text-zinc-600",
            "prose-blockquote:border-l-yellow-500 prose-blockquote:bg-zinc-900/50 prose-blockquote:py-1 prose-blockquote:pr-4",
            className
        )}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </article>
    );
}
