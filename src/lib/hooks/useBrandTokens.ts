import { useState, useEffect, useCallback } from "react";
import { BrandTokens } from "@/lib/design-tokens/types";
import { coreBrandTokens } from "@/lib/design-tokens/core";
import { toast } from "sonner";

interface UseBrandTokensReturn {
    brandTokens: BrandTokens;
    isLoading: boolean;
    saveTokens: (tokens: BrandTokens) => Promise<boolean>;
    refreshTokens: () => Promise<void>;
}

export function useBrandTokens(brandId: string): UseBrandTokensReturn {
    const [brandTokens, setBrandTokens] = useState<BrandTokens>(coreBrandTokens);
    const [isLoading, setIsLoading] = useState(true);

    const refreshTokens = useCallback(async () => {
        setIsLoading(true);
        try {
            // Use the specific endpoint for loading tokens
            const response = await fetch(`/api/tokens/load?brandId=${brandId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.tokens) {
                    // Merge with core tokens to ensure all fields exist
                    setBrandTokens({
                        ...coreBrandTokens,
                        ...data.tokens,
                        // Deep merge for nested objects if necessary, but simple spread usually works 
                        // if the structure is flat enough or if we replace whole sections.
                        // For now, assuming data.tokens has the correct structure.
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching brand tokens:", error);
            // Fallback to core tokens is already set in initial state
        } finally {
            setIsLoading(false);
        }
    }, [brandId]);

    useEffect(() => {
        if (brandId) {
            void refreshTokens();
        }
    }, [brandId, refreshTokens]);

    const saveTokens = async (tokens: BrandTokens) => {
        try {
            const response = await fetch("/api/tokens/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    brandId,
                    tokens,
                }),
            });

            if (response.ok) {
                setBrandTokens(tokens);
                toast.success("Tokens de marca actualizados.");
                return true;
            } else {
                const errorPayload = await response
                    .json()
                    .catch(() => ({ error: "Error saving tokens" }));
                throw new Error(errorPayload.error || "Error saving tokens");
            }
        } catch (error) {
            console.error("Error saving brand tokens:", error);
            const message = error instanceof Error ? error.message : "Error al guardar los tokens.";
            toast.error(message);
            return false;
        }
    };

    return { brandTokens, isLoading, saveTokens, refreshTokens };
}
