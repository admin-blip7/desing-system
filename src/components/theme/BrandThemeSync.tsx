"use client";

import { useEffect } from "react";
import { useBrandTheme } from "@/components/theme/BrandThemeProvider";

interface BrandThemeSyncProps {
  personalityId: string | null | undefined;
}

export default function BrandThemeSync({ personalityId }: BrandThemeSyncProps) {
  const { activeBrandId, applyBrandTheme } = useBrandTheme();

  useEffect(() => {
    if (!personalityId) return;
    if (personalityId === activeBrandId) return;
    applyBrandTheme(personalityId);
  }, [personalityId, activeBrandId, applyBrandTheme]);

  return null;
}
