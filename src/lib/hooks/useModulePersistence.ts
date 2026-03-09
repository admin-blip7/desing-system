import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface UseModulePersistenceReturn<T> {
    data: T | null;
    status: string;
    isSaving: boolean;
    isLoading: boolean;
    saveModule: (content: T) => Promise<boolean>;
    updateStatus: (newStatus: string) => Promise<boolean>;
    loadModule: () => Promise<void>;
}

const MAX_INLINE_IMAGE_DATA_URL_LENGTH = 300_000;
const MAX_REQUEST_BODY_CHARS = 5_000_000;

function isLikelyRawBase64Image(value: string): boolean {
    if (value.length <= MAX_INLINE_IMAGE_DATA_URL_LENGTH) return false;
    if (!/^[A-Za-z0-9+/=\n\r]+$/.test(value)) return false;
    const normalized = value.replace(/\s+/g, "");
    return /^(iVBOR|\/9j\/|R0lGOD|UklGR|Qk)/.test(normalized);
}

function sanitizeLargeInlineImages(value: unknown, seen = new WeakSet<object>()): unknown {
    if (typeof value === "string") {
        if (value.startsWith("data:image/") && value.length > MAX_INLINE_IMAGE_DATA_URL_LENGTH) {
            return "";
        }
        if (isLikelyRawBase64Image(value)) {
            return "";
        }
        return value;
    }

    if (!value || typeof value !== "object") {
        return value;
    }

    if (seen.has(value as object)) {
        return value;
    }
    seen.add(value as object);

    if (Array.isArray(value)) {
        return value.map((item) => sanitizeLargeInlineImages(item, seen));
    }

    const record = value as Record<string, unknown>;
    const sanitizedEntries = Object.entries(record).map(([key, item]) => [
        key,
        sanitizeLargeInlineImages(item, seen),
    ]);

    return Object.fromEntries(sanitizedEntries);
}

function collapseRedundantContentWrappers(value: unknown, depth = 0): unknown {
    if (!value || typeof value !== "object" || depth > 12) return value;
    if (Array.isArray(value)) {
        return value.map((item) => collapseRedundantContentWrappers(item, depth + 1));
    }

    const record = value as Record<string, unknown>;
    const inner = record.content;
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
        const keys = Object.keys(record);
        const innerRecord = inner as Record<string, unknown>;
        const hasOverlap = keys.some((key) => key !== "content" && key in innerRecord);
        if (keys.length === 1 || hasOverlap) {
            return collapseRedundantContentWrappers(inner, depth + 1);
        }
    }

    const normalizedEntries = Object.entries(record).map(([key, item]) => [
        key,
        collapseRedundantContentWrappers(item, depth + 1),
    ]);
    return Object.fromEntries(normalizedEntries);
}

function logLargeDataUrls(value: unknown, path = "content"): void {
    if (typeof value === "string") {
        if (value.startsWith("data:image/")) {
            console.log(`[DEBUG useModulePersistence] Found data URL at ${path}, size:`, value.length);
        } else if (isLikelyRawBase64Image(value)) {
            console.log(`[DEBUG useModulePersistence] Found raw base64 image at ${path}, size:`, value.length);
        }
        return;
    }

    if (!value || typeof value !== "object") {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => logLargeDataUrls(item, `${path}[${index}]`));
        return;
    }

    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
        logLargeDataUrls(item, `${path}.${key}`);
    }
}

export function useModulePersistence<T>(
    brandId: string,
    moduleKey: string
): UseModulePersistenceReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState<string>("pending");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadModule = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/modules/load?brandId=${brandId}&moduleKey=${moduleKey}`
            );
            if (response.ok) {
                const result = await response.json();
                if (result.data) {
                    setData(result.data.content);
                    setStatus(result.data.status || "pending");
                }
            }
        } catch (error) {
            console.error("Error loading module:", error);
            toast.error("Error al cargar los datos del módulo.");
        } finally {
            setIsLoading(false);
        }
    }, [brandId, moduleKey]);

    useEffect(() => {
        if (brandId && moduleKey) {
            void loadModule();
        }
    }, [brandId, moduleKey, loadModule]);

    useEffect(() => {
        const handleExternalModuleUpdate = (event: Event) => {
            const customEvent = event as CustomEvent<{ brandId?: string; moduleKey?: string }>;
            const updatedBrandId = customEvent.detail?.brandId;
            const updatedModuleKey = customEvent.detail?.moduleKey;

            if (updatedBrandId === brandId && updatedModuleKey === moduleKey) {
                void loadModule();
            }
        };

        window.addEventListener("module-updated", handleExternalModuleUpdate as EventListener);
        return () => {
            window.removeEventListener("module-updated", handleExternalModuleUpdate as EventListener);
        };
    }, [brandId, moduleKey, loadModule]);

    const saveModule = async (content: T) => {
        setIsSaving(true);
        try {
            const collapsedContent = collapseRedundantContentWrappers(content);
            const sanitizedContent = sanitizeLargeInlineImages(collapsedContent) as T;
            const requestBody = JSON.stringify({
                brandId,
                moduleKey,
                content: sanitizedContent,
                status: status === "pending" ? "in_progress" : status,
            });

            console.log("[DEBUG useModulePersistence] Request body size:", requestBody.length, "characters");
            logLargeDataUrls(content);

            if (requestBody.length > MAX_REQUEST_BODY_CHARS) {
                throw new Error("El contenido es demasiado grande para guardarse. Optimiza o reduce imágenes embebidas.");
            }

            const response = await fetch("/api/modules/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: requestBody,
            });

            console.log("[DEBUG useModulePersistence] Response status:", response.status);

            if (response.ok) {
                setData(content);
                if (status === "pending") setStatus("in_progress");
                toast.success("Cambios guardados exitosamente.");
                return true;
            } else {
                const responseText = await response.text();
                console.log("[DEBUG useModulePersistence] Error response body:", responseText.substring(0, 500));
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                } catch {
                    errorData = {};
                }
                const errorMessage = errorData?.error || errorData?.details || `Error ${response.status}: Error al guardar`;
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Error saving module:", error);
            toast.error("Error al guardar los cambios.");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        // Optimistic update
        const prevStatus = status;
        setStatus(newStatus);

        try {
            const response = await fetch("/api/modules/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    brandId,
                    moduleKey,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }
            return true;
        } catch (error) {
            console.error("Error updating status:", error);
            setStatus(prevStatus); // Revert
            toast.error("Error al actualizar el estado.");
            return false;
        }
    };

    return { data, status, isSaving, isLoading, saveModule, updateStatus, loadModule };
}
