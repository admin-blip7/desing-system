"use client";

import React, { useRef, useState } from "react";
import { Upload, X, File as FileIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSizeMB?: number;
    isLoading?: boolean;
    className?: string;
    label?: string;
}

export function FileUploader({
    onFileSelect,
    accept = "image/*",
    maxSizeMB = 5,
    isLoading = false,
    className,
    label = "Arrastra tu archivo aquí o haz clic para seleccionar",
}: FileUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file: File) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`El archivo excede el tamaño máximo de ${maxSizeMB}MB`);
            return false;
        }
        // Simple mime type check could be added here
        setError(null);
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    };

    const onButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors transition-all duration-200 ease-in-out",
                    dragActive
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50",
                    isLoading && "opacity-50 pointer-events-none"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                    disabled={isLoading}
                />

                {isLoading ? (
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                ) : (
                    <Upload className="w-10 h-10 text-zinc-600 mb-4" />
                )}

                <p className="text-sm font-medium text-zinc-300 mb-2">
                    {isLoading ? "Subiendo..." : label}
                </p>
                <p className="text-xs text-zinc-500 mb-6">
                    SVG, PNG, JPG (Max {maxSizeMB}MB)
                </p>

                <Button
                    variant="outline"
                    onClick={onButtonClick}
                    disabled={isLoading}
                    type="button"
                >
                    Seleccionar Archivo
                </Button>

                {error && (
                    <div className="absolute bottom-2 text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
