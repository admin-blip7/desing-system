"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import { coreBrandTokens } from "@/lib/design-tokens/core";
import { BrandTokens } from "@/lib/design-tokens/types";
import { applyBrandThemeToDocument, resolveBrandTheme } from "@/lib/design-tokens/theme-service";
import { BRAND_THEME_STORAGE_KEY } from "@/lib/design-tokens/storage";

interface BrandThemeContextValue {
  activeBrandId: string;
  tokens: BrandTokens;
  applyBrandTheme: (brandId: string) => void;
}

const BrandThemeContext = createContext<BrandThemeContextValue | undefined>(undefined);

interface BrandThemeProviderProps {
  children: React.ReactNode;
  initialBrandId?: string | null;
}

export default function BrandThemeProvider({ children, initialBrandId = null }: BrandThemeProviderProps) {
  const [themeState, setThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const storedThemeId = window.localStorage.getItem(BRAND_THEME_STORAGE_KEY);
        if (storedThemeId) {
          return resolveBrandTheme(storedThemeId);
        }
      } catch {
        // Ignore storage lookup errors.
      }
    }

    if (initialBrandId) {
      return resolveBrandTheme(initialBrandId);
    }

    return resolveBrandTheme("manual");
  });
  const activeBrandId = themeState.brandId || "manual";
  const tokens: BrandTokens = themeState.tokens || coreBrandTokens;

  const applyBrandTheme = useCallback((brandId: string) => {
    const resolution = applyBrandThemeToDocument(brandId);
    setThemeState(resolution);
  }, []);

  useLayoutEffect(() => {
    applyBrandThemeToDocument(activeBrandId, { persist: false });
  }, [activeBrandId]);

  const value = useMemo(
    () => ({
      activeBrandId,
      tokens,
      applyBrandTheme,
    }),
    [activeBrandId, tokens, applyBrandTheme],
  );

  return <BrandThemeContext.Provider value={value}>{children}</BrandThemeContext.Provider>;
}

export function useBrandTheme() {
  const context = useContext(BrandThemeContext);
  if (!context) {
    throw new Error("useBrandTheme must be used within BrandThemeProvider");
  }

  return context;
}
