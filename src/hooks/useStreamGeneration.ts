"use client";

import { useCallback, useState } from "react";

interface StreamEvent {
  type: string;
  [key: string]: unknown;
}

export function useStreamGeneration() {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (brandId: string, moduleKey: string) => {
    setEvents([]);
    setError(null);
    setIsRunning(true);
    const collectedEvents: StreamEvent[] = [];

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ brandId, moduleKey }),
      });

      if (!response.ok || !response.body) {
        const responseText = await response.text();
        throw new Error(responseText || "Unable to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";

        chunks.forEach((chunk) => {
          const line = chunk.trim();
          if (!line.startsWith("data:")) return;

          const payload = line.replace(/^data:\s*/, "");
          try {
            const event = JSON.parse(payload) as StreamEvent;
            collectedEvents.push(event);
            setEvents((prev) => [...prev, event]);
            if (event.type === "error") {
              setError(String(event.error || "Error"));
            }
          } catch {
            // Ignore malformed chunks and continue consuming stream.
          }
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown stream error";
      setError(message);
      return { success: false, error: message, events: collectedEvents };
    } finally {
      setIsRunning(false);
    }

    const resultEvent = collectedEvents.find((event) => event.type === "result");
    const errorEvent = collectedEvents.find((event) => event.type === "error");

    if (errorEvent) {
      return {
        success: false,
        error: String(errorEvent.error || "Generation failed"),
        events: collectedEvents,
      };
    }

    return {
      success: !!resultEvent,
      data: resultEvent?.data,
      events: collectedEvents,
    };
  }, []);

  return { run, events, isRunning, error };
}
