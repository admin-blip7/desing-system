/* eslint-disable @next/next/no-img-element */
import React from 'react';
import MarkdownPreview from './MarkdownPreview';

interface ImagePreviewProps {
    content: {
        imageUrl?: string;
        text?: string;
        imagePrompt?: string;
    } | string;
}

export default function ImagePreview({ content }: ImagePreviewProps) {
    // Handle case where content might be just a string (legacy or fallback)
    const data = typeof content === 'string' ? { text: content } : content;
    const { imageUrl, text, imagePrompt } = data;

    return (
        <div className="space-y-6">
            {imageUrl && (
                <div className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-900 group relative">
                    <img
                        src={imageUrl}
                        alt="Generated Brand Asset"
                        className="w-full h-auto object-cover max-h-[600px]"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs text-zinc-300 font-mono line-clamp-2">{imagePrompt}</p>
                    </div>
                </div>
            )}

            {text && (
                <div className="prose prose-invert max-w-none">
                    <MarkdownPreview content={text} />
                </div>
            )}

            {!imageUrl && !text && (
                <div className="p-8 text-center text-zinc-500 bg-zinc-900/50 rounded-lg dashed border border-zinc-800">
                    No content available to preview.
                </div>
            )}
        </div>
    );
}
