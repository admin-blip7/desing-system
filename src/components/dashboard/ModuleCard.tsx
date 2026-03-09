import { PromptModule } from "@/lib/data/phases";
import { Loader2, CheckCircle2, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface ModuleCardProps {
  module: PromptModule;
  status: "locked" | "pending" | "generating" | "completed" | "error";
  onStart: () => void;
  index: number;
  href?: string;
}

export default function ModuleCard({
  module,
  status = "pending",
  onStart,
  index,
  href
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative transition-all duration-120"
      style={{
        background: "var(--flow-bg-card)",
        borderRadius: "var(--flow-radius-card)",
        padding: "var(--flow-pad-card)",
        border:
          status === "locked"
            ? "1px solid var(--flow-border-main)"
            : status === "completed"
              ? "1px solid var(--flow-green-border)"
              : "1px solid var(--flow-border-card)",
        opacity: status === "locked" ? 0.5 : 1,
      }}
    >
      {/* Header with name and status */}
      <div
        className="mb-3 flex items-start justify-between"
        style={{ gap: "var(--flow-gap-medium)" }}
      >
        {href ? (
          <Link
            href={href}
            className="transition-colors hover:underline"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color:
                status === "completed"
                  ? "var(--bm-color-success)"
                  : "var(--flow-text-primary)",
            }}
          >
            {module.name}
          </Link>
        ) : (
          <h3
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color:
                status === "completed"
                  ? "var(--bm-color-success)"
                  : "var(--flow-text-primary)",
            }}
          >
            {module.name}
          </h3>
        )}

        {/* Status indicator */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "var(--flow-radius-dot)",
            background:
              status === "completed"
                ? "var(--bm-color-success)"
                : status === "generating"
                  ? "var(--flow-phase-1)"
                  : status === "locked"
                    ? "var(--flow-bg-secondary)"
                    : "var(--flow-border-element)",
          }}
        >
          {status === "locked" && (
            <Lock size={10} style={{ color: "var(--flow-text-tertiary)" }} />
          )}
          {status === "pending" && (
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "var(--flow-radius-dot)",
                background: "var(--flow-text-disabled)",
              }}
            />
          )}
          {status === "generating" && (
            <Loader2 size={10} className="animate-spin" style={{ color: "var(--flow-phase-1)" }} />
          )}
          {status === "completed" && (
            <CheckCircle2 size={12} style={{ color: "var(--bm-color-success)" }} />
          )}
        </div>
      </div>

      {/* Description */}
      <p
        className="mb-3 line-clamp-2 leading-relaxed"
        style={{
          fontSize: "11px",
          color: "var(--flow-text-secondary)",
          minHeight: "36px",
        }}
      >
        {module.aiGenerates}
      </p>

      {/* Feeds Into Tags */}
      <div
        className="mb-3 flex flex-wrap"
        style={{ gap: "var(--flow-gap-tiny)" }}
      >
        {module.feedsInto.slice(0, 3).map((tag, i) => (
          <span
            key={i}
            className="inline-flex"
            style={{
              fontSize: "9px",
              padding: "2px 6px",
              borderRadius: "var(--flow-radius-tag)",
              background: "var(--flow-bg-secondary)",
              color: "var(--flow-text-tertiary)",
              border: "1px solid var(--flow-border-element)",
            }}
          >
            → {tag}
          </span>
        ))}
        {module.feedsInto.length > 3 && (
          <span
            style={{
              fontSize: "9px",
              padding: "2px 6px",
              borderRadius: "var(--flow-radius-tag)",
              background: "var(--flow-bg-secondary)",
              color: "var(--flow-text-tertiary)",
              border: "1px solid var(--flow-border-element)",
            }}
          >
            +{module.feedsInto.length - 3}
          </span>
        )}
      </div>

      {/* Divider */}
      <div
        className="mb-3"
        style={{
          height: "1px",
          background: "var(--flow-border-main)",
        }}
      />

      {/* Actions */}
      {href && (
        <Link
          href={href}
          className="mb-2 inline-flex w-full items-center justify-center transition-opacity hover:opacity-90"
          style={{
            padding: "8px",
            borderRadius: "var(--flow-radius-button)",
            border: "1px solid var(--flow-border-element)",
            background: "var(--flow-bg-secondary)",
            fontSize: "11px",
            color: "var(--flow-text-primary)",
          }}
        >
          Abrir Workspace
        </Link>
      )}
      {status === "completed" ? (
        <button
          onClick={onStart}
          className="w-full transition-opacity hover:opacity-90"
          style={{
            padding: "8px",
            borderRadius: "var(--flow-radius-button)",
            border: "1px solid var(--flow-green-border)",
            background: "rgba(16, 185, 129, 0.16)",
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--bm-color-success)",
          }}
        >
          Ver Resultado
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={status === "locked" || status === "generating"}
          className="flex w-full items-center justify-center gap-2 transition-all"
          style={{
            padding: "8px",
            borderRadius: "var(--flow-radius-button)",
            border:
              status === "generating"
                ? "1px solid rgba(245, 197, 24, 0.25)"
                : "1px solid var(--flow-border-element)",
            background:
              status === "generating"
                ? "var(--flow-yellow-bg)"
                : "var(--flow-bg-secondary)",
            fontSize: "11px",
            fontWeight: 500,
            color:
              status === "generating"
                ? "var(--flow-phase-1)"
                : "var(--flow-text-primary)",
            cursor:
              status === "locked" || status === "generating"
                ? "not-allowed"
                : "pointer",
            opacity: status === "locked" ? 0.6 : 1,
          }}
        >
          {status === "generating" ? (
            <>Generando...</>
          ) : (
            <>
              <Play size={12} className="fill-current" />
              Comenzar Módulo
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
