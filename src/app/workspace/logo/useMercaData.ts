"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  BrandGenerationSessionListResponse,
  BrandGenerationSessionPayload,
  MarketCompetitorInsight,
  MarketData,
} from "@/app/workspace/logo/types";

interface UseMercaDataResult {
  merca: MarketData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const output: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== "string") {
      continue;
    }

    const normalized = item.trim();
    if (!normalized) {
      continue;
    }

    const dedupeKey = normalized.toLowerCase();
    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    output.push(normalized);
  }

  return output;
}

function buildCompetitorInsight(raw: {
  name: string;
  strengths?: string[];
  weaknesses?: string[];
  marketSignals?: string[];
}): MarketCompetitorInsight {
  return {
    id: raw.name.toLowerCase().replace(/\s+/g, "-"),
    name: raw.name.trim(),
    strengths: toStringArray(raw.strengths || []),
    weaknesses: toStringArray(raw.weaknesses || []),
    marketSignals: toStringArray(raw.marketSignals || []),
  };
}

function fromCompletedSession(session: BrandGenerationSessionPayload): MarketData | null {
  const research = session.result?.artifacts?.competitiveResearch;
  if (!research) {
    return null;
  }

  const competitorInsightsRaw = Array.isArray(research.competitorInsights)
    ? research.competitorInsights.filter(
        (item): item is { name: string; strengths?: string[]; weaknesses?: string[]; marketSignals?: string[] } =>
          Boolean(item && typeof item.name === "string" && item.name.trim().length > 0),
      )
    : [];

  const competitors = competitorInsightsRaw.map(buildCompetitorInsight);
  const marketSignalsFromCompetitors = competitors.flatMap((item) => item.marketSignals);
  const marketSignals = toStringArray([...marketSignalsFromCompetitors]);

  return {
    source: "brand-generation-session",
    brandName: session.input.brandName,
    industry: session.input.industry,
    updatedAt: session.updatedAt,
    sessionId: session.id,
    competitors,
    marketSignals,
    whitespaceOpportunities: toStringArray(research.whitespaceOpportunities || []),
    strategicRisks: toStringArray(research.strategicRisks || []),
  };
}

function fromFallbackSession(session: BrandGenerationSessionPayload): MarketData {
  const competitors = toStringArray(session.input.competitors || []).map((name) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    strengths: [],
    weaknesses: [],
    marketSignals: [],
  }));

  return {
    source: "brief-fallback",
    brandName: session.input.brandName,
    industry: session.input.industry,
    updatedAt: session.updatedAt,
    sessionId: session.id,
    competitors,
    marketSignals: [],
    whitespaceOpportunities: [],
    strategicRisks: [],
  };
}

function byDateDesc(a: BrandGenerationSessionPayload, b: BrandGenerationSessionPayload) {
  return a.updatedAt > b.updatedAt ? -1 : 1;
}

export function useMercaData(brandId: string): UseMercaDataResult {
  const [merca, setMerca] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!brandId) {
      setMerca(null);
      setError("No se pudo resolver la marca para cargar el dataset de mercado.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/brand-generation/sessions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const details = await response.text().catch(() => "");
        throw new Error(details || `No fue posible obtener sesiones (${response.status}).`);
      }

      const payload = (await response.json()) as BrandGenerationSessionListResponse;
      const sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
      const brandSessions = sessions.filter((session) => session.brandId === brandId).sort(byDateDesc);

      if (brandSessions.length === 0) {
        setMerca(null);
        setIsLoading(false);
        return;
      }

      const completedWithMarket = brandSessions.find(
        (session) =>
          session.status === "completed" &&
          Boolean(session.result?.artifacts?.competitiveResearch),
      );

      if (completedWithMarket) {
        const fromCompleted = fromCompletedSession(completedWithMarket);
        if (fromCompleted) {
          setMerca(fromCompleted);
          setIsLoading(false);
          return;
        }
      }

      setMerca(fromFallbackSession(brandSessions[0]));
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "No fue posible cargar el dataset de mercado.";
      setError(message);
      setMerca(null);
    } finally {
      setIsLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      await refresh();
    };

    run().catch(() => {
      if (!isMounted) {
        return;
      }
      setError("No fue posible cargar el dataset de mercado.");
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [refresh]);

  return {
    merca,
    isLoading,
    error,
    refresh,
  };
}
