import type { LogEvent, Logger } from "./types";

export function createStructuredLogger(sessionId: string): Logger {
  const events: LogEvent[] = [];

  const push = (
    level: LogEvent["level"],
    message: string,
    context?: Record<string, unknown>
  ) => {
    const event: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      message,
      sessionId,
      context,
    };

    events.push(event);

    if (level === "error") {
      console.error(`[BrandFlow:${sessionId}] ${message}`, context || {});
      return;
    }

    if (level === "warn") {
      console.warn(`[BrandFlow:${sessionId}] ${message}`, context || {});
      return;
    }

    if (level === "debug") {
      console.debug(`[BrandFlow:${sessionId}] ${message}`, context || {});
      return;
    }

    console.info(`[BrandFlow:${sessionId}] ${message}`, context || {});
  };

  return {
    debug(message, context) {
      push("debug", message, context);
    },
    info(message, context) {
      push("info", message, context);
    },
    warn(message, context) {
      push("warn", message, context);
    },
    error(message, context) {
      push("error", message, context);
    },
    getEvents() {
      return [...events];
    },
  };
}
